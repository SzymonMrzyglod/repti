import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import react from "@vitejs/plugin-react";
import { renderGuidePage, renderHomePage, withHomeMeta } from "./seo-plugin.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const template = `<html><head><title>Old</title>
<meta name="description" content="Old" />
<link rel="canonical" href="https://example.com/" />
</head><body><div id="root"></div></body></html>`;
const guide = {
  _id: "guide-test",
  title: { pl: "Gekon & poradnik", en: "Gecko guide" },
  excerpt: { pl: "Wprowadzenie" },
  body: [
    { _key: "heading", _type: "block", style: "h2", children: [
      { _key: "heading-text", _type: "span", text: "Jak dbać?", marks: [] },
    ] },
    { _key: "paragraph", _type: "block", style: "normal", markDefs: [
      { _key: "link", _type: "link", href: "https://example.com/", openInNewTab: true },
    ], children: [
      { _key: "text", _type: "span", text: "Tekst ", marks: [] },
      { _key: "linked", _type: "span", text: "z linkiem", marks: ["link", "strong"] },
      { _key: "unsafe", _type: "span", text: "</script><script>alert(1)</script>", marks: [] },
    ] },
    { _key: "item", _type: "block", listItem: "bullet", level: 1, children: [
      { _key: "item-text", _type: "span", text: "Lista", marks: [] },
    ] },
    { _key: "image", _type: "image", assetUrl: "https://example.com/gecko.jpg", alt: "Gekon", layout: "left" },
  ],
};

let server;
let renderGuide;
let renderHome;
before(async () => {
  server = await createServer({
    configFile: false,
    root,
    plugins: [react()],
    resolve: { alias: { "@": root } },
    server: { middlewareMode: true },
    appType: "custom",
  });
  ({ renderGuide } = await server.ssrLoadModule("/scripts/render-guide.tsx"));
  ({ renderHome } = await server.ssrLoadModule("/scripts/render-home.tsx"));
});
after(async () => {
  await server?.close();
});

test("guide HTML contains the actual formatted article and safe snapshot", () => {
  const html = renderGuidePage(template, guide, renderGuide);
  assert.match(html, /<title>Gekon &amp; poradnik \| O ty gadzie!<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/o-ty-gadzie\.pl\/guides\/guide-test\/"/);
  const [article] = html.match(/<article[\s\S]*?<\/article>/) || [];
  assert.ok(article);
  assert.match(article, /<h1[^>]*>Gekon &amp; poradnik<\/h1>/);
  assert.match(article, /<h3[^>]*>Jak dbać\?<\/h3>/);
  assert.match(article, /<strong>z linkiem<\/strong>/);
  assert.match(article, /href="https:\/\/example\.com\/"/);
  assert.match(article, /<li[^>]*>Lista<\/li>/);
  assert.match(article, /<img[^>]*alt="Gekon"/);
  assert.match(article, /&lt;\/script&gt;/);
  const snapshot = html.match(/<script id="guide-snapshot" type="application\/json">([\s\S]*?)<\/script>/);
  assert.ok(snapshot);
  assert.deepEqual(JSON.parse(snapshot[1]), guide);
  assert.doesNotMatch(snapshot[1], /<\/script>/i);
});

test("missing root element fails the build instead of publishing an empty guide", () => {
  assert.throws(() => renderGuidePage("<html></html>", guide, renderGuide), /root element not found/);
});

test("homepage metadata uses published CMS values and escapes HTML", () => {
  const homeTemplate = template.replace("</head>", `<meta property="og:title" content="Old" />
<meta property="og:description" content="Old" />
<meta name="twitter:title" content="Old" />
<meta name="twitter:description" content="Old" /></head>`);
  const html = withHomeMeta(homeTemplate, {
    seoTitle: { pl: "Gekony & węże" },
    seoDescription: { pl: "Hodowla na Śląsku" },
  });
  assert.match(html, /<title>Gekony &amp; węże<\/title>/);
  assert.match(html, /property="og:title" content="Gekony &amp; węże"/);
  assert.match(html, /name="twitter:title" content="Gekony &amp; węże"/);
  assert.match(html, /name="description" content="Hodowla na Śląsku"/);
  assert.match(html, /property="og:description" content="Hodowla na Śląsku"/);
  assert.match(html, /name="twitter:description" content="Hodowla na Śląsku"/);
  assert.equal(withHomeMeta(homeTemplate, null), homeTemplate);
});

test("homepage renders CMS content, animal links and a safe snapshot", () => {
  const data = {
    settings: {
      heroTitle: { pl: "Nasza hodowla" },
      heroText: { pl: "Gekony orzęsione i węże zbożowe" },
      historyText: { pl: "Jastrzębie-Zdrój </script><script>alert(1)</script>" },
      seoTitle: { pl: "Hodowla na Śląsku" },
    },
    reptiles: [{
      _id: "animal-test",
      name: { pl: "Gekon testowy" },
      speciesId: "species-test",
      speciesName: { pl: "Gekon orzęsiony" },
      morph: { pl: "Harlequin" },
      status: "available",
      imageUrl: "https://example.com/gecko.jpg",
    }],
  };
  const html = renderHomePage(template, data, renderHome, [
    { href: "/guides/test/", label: "Poradnik gekona" },
  ]);
  assert.match(html, /<title>Hodowla na Śląsku<\/title>/);
  assert.match(html, /<h1[^>]*>Nasza hodowla<\/h1>/);
  assert.match(html, /Gekony orzęsione i węże zbożowe/);
  assert.match(html, /Jastrzębie-Zdrój &lt;\/script&gt;/);
  assert.match(html, /href="\/animal\/animal-test\/"/);
  assert.match(html, /href="\/guides\/test\/">Poradnik gekona/);
  const snapshot = html.match(/<script id="home-snapshot" type="application\/json">([\s\S]*?)<\/script>/);
  assert.ok(snapshot);
  assert.deepEqual(JSON.parse(snapshot[1]), data);
  assert.doesNotMatch(snapshot[1], /<\/script>/i);
  assert.throws(() => renderHomePage("<html></html>", data, renderHome, []), /root element not found/);
});
