import fs from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://o-ty-gadzie.pl";
const SITE_NAME = "O ty gadzie!";
const SANITY_API =
  "https://t5to691s.apicdn.sanity.io/v2026-10-28/data/query/production";

const query = `{
  "reptiles": *[_type == "reptile"]{_id, name, morph, description, "species": species->name.pl, "image": coalesce(image.asset->url, gallery[0].asset->url), _updatedAt},
  "guides": *[_type == "guide"]{_id, title, excerpt, "image": image.asset->url, _updatedAt}
}`;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeXml = (value) => escapeHtml(value).replace(/'/g, "&apos;");

const pick = (value) => (value?.pl || value?.en || "").trim();

const truncate = (text, max = 160) => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
};

async function fetchContent() {
  try {
    const response = await fetch(`${SANITY_API}?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error(`Sanity responded with ${response.status}`);
    const { result } = await response.json();
    return { reptiles: result.reptiles || [], guides: result.guides || [] };
  } catch (error) {
    console.warn(`[seo] Could not load CMS content: ${error.message}`);
    return { reptiles: [], guides: [] };
  }
}

function withMeta(html, { title, description, url, image }) {
  const replacements = [
    [/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`],
    [
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeHtml(description)}" />`,
    ],
    [
      /<link rel="canonical" href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${url}" />`,
    ],
    [
      /<meta property="og:title" content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${escapeHtml(title)}" />`,
    ],
    [
      /<meta property="og:description" content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${escapeHtml(description)}" />`,
    ],
    [
      /<meta property="og:url" content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${url}" />`,
    ],
    [
      /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    ],
    [
      /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    ],
  ];

  if (image) {
    replacements.push(
      [
        /<meta property="og:image" content="[^"]*"\s*\/?>/,
        `<meta property="og:image" content="${escapeHtml(image)}" />`,
      ],
      [
        /<meta name="twitter:image" content="[^"]*"\s*\/?>/,
        `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
      ],
    );
  }

  return replacements.reduce(
    (output, [pattern, replacement]) => output.replace(pattern, () => replacement),
    html,
  );
}

async function writePage(outDir, route, html) {
  const directory = path.join(outDir, route);
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, "index.html"), html);
}

// Generates sitemap.xml, robots.txt, a 404 fallback and per-route HTML with correct
// <head> metadata, so crawlers and link previews see it without running JavaScript.
export default function seoPlugin() {
  let outDir = "dist";

  return {
    name: "repti-seo",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const template = await fs.readFile(path.join(outDir, "index.html"), "utf8");
      const { reptiles, guides } = await fetchContent();
      const today = new Date().toISOString().slice(0, 10);

      const urls = [
        { loc: `${SITE_URL}/`, lastmod: today, priority: "1.0" },
        { loc: `${SITE_URL}/guides`, lastmod: today, priority: "0.7" },
      ];

      await writePage(outDir, "guides", withMeta(template, {
        title: `Poradniki o opiece nad gadami | ${SITE_NAME}`,
        description:
          "Poradniki hodowcy: terrarium, żywienie i pierwsze dni gekona orzęsionego oraz węża zbożowego w nowym domu.",
        url: `${SITE_URL}/guides`,
      }));

      const contactPage = withMeta(template, {
        title: `Kontakt | ${SITE_NAME}`,
        description: "Skontaktuj się z hodowlą O ty gadzie!",
        url: `${SITE_URL}/contact`,
      }).replace(
        /<meta name="robots" content="[^"]*"\s*\/?>/,
        '<meta name="robots" content="noindex, nofollow" />',
      );
      await writePage(outDir, "contact", contactPage);

      for (const reptile of reptiles) {
        const route = `animal/${reptile._id}`;
        const name = pick(reptile.name);
        const morph = pick(reptile.morph);
        const title = [name, morph].filter(Boolean).join(" — ") || SITE_NAME;
        const description =
          truncate(pick(reptile.description)) ||
          [name, morph, reptile.species].filter(Boolean).join(", ");
        const url = `${SITE_URL}/${route}`;

        await writePage(outDir, route, withMeta(template, {
          title: `${title} | ${SITE_NAME}`,
          description,
          url,
          image: reptile.image && `${reptile.image}?auto=format&fit=max&w=1200&q=84`,
        }));
        urls.push({ loc: url, lastmod: (reptile._updatedAt || today).slice(0, 10), priority: "0.8" });
      }

      for (const guide of guides) {
        const route = `guides/${guide._id}`;
        const title = pick(guide.title) || SITE_NAME;
        const url = `${SITE_URL}/${route}`;

        await writePage(outDir, route, withMeta(template, {
          title: `${title} | ${SITE_NAME}`,
          description: truncate(pick(guide.excerpt)) || "Poradnik hodowcy gadów.",
          url,
          image: guide.image && `${guide.image}?auto=format&fit=max&w=1200&q=84`,
        }));
        urls.push({ loc: url, lastmod: (guide._updatedAt || today).slice(0, 10), priority: "0.6" });
      }

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod, priority }) =>
      `  <url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`,
  )
  .join("\n")}
</urlset>
`;

      const crawlLinks = [
        ...reptiles.map((reptile) => ({
          href: `/animal/${reptile._id}`,
          label: [pick(reptile.name), pick(reptile.morph)].filter(Boolean).join(" — "),
        })),
        ...guides.map((guide) => ({
          href: `/guides/${guide._id}`,
          label: pick(guide.title),
        })),
      ].filter((link) => link.label);

      if (crawlLinks.length) {
        const noscript = `<noscript>
      <h1>${SITE_NAME} — hodowla gekonów orzęsionych i węży zbożowych</h1>
      <nav>
${crawlLinks.map((link) => `        <a href="${link.href}">${escapeHtml(link.label)}</a>`).join("\n")}
        <a href="/guides">Poradniki</a>
      </nav>
    </noscript>`;
        const homePage = template.replace(
          '<div id="root"></div>',
          `<div id="root"></div>\n    ${noscript}`,
        );
        await fs.writeFile(path.join(outDir, "index.html"), homePage);
      }

      await fs.writeFile(path.join(outDir, "sitemap.xml"), sitemap);
      await fs.writeFile(
        path.join(outDir, "robots.txt"),
        `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      );
      const notFoundPage = withMeta(template, {
        title: `Nie znaleziono strony | ${SITE_NAME}`,
        description: "Nie znaleziono strony pod tym adresem.",
        url: `${SITE_URL}/404`,
      }).replace(
        /<meta name="robots" content="[^"]*"\s*\/?>/,
        '<meta name="robots" content="noindex, nofollow" />',
      );
      await fs.writeFile(path.join(outDir, "404.html"), notFoundPage);
      console.log(`[seo] sitemap.xml with ${urls.length} URLs`);
    },
  };
}
