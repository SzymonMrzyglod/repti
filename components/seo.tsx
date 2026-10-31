import { useEffect } from "react";
import { useLocale } from "@/lib/locale-context";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

type SeoProps = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "product";
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
};

function setTag(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let element = document.head.querySelector<HTMLElement>(selector);
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  element.setAttribute(attr, value);
}

function setMeta(key: "name" | "property", name: string, content: string) {
  setTag(
    `meta[${key}="${name}"]`,
    () => {
      const meta = document.createElement("meta");
      meta.setAttribute(key, name);
      return meta;
    },
    "content",
    content,
  );
}

const JSON_LD_ID = "page-jsonld";

export default function Seo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noindex = false,
  jsonLd,
}: SeoProps) {
  const { locale } = useLocale();
  const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    const url = absoluteUrl(path);
    document.documentElement.lang = locale;
    document.title = title;

    setMeta("name", "description", description);
    setMeta(
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    );
    setTag(
      'link[rel="canonical"]',
      () => {
        const link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        return link;
      },
      "href",
      url,
    );

    setMeta("property", "og:type", type === "product" ? "website" : type);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", locale === "pl" ? "pl_PL" : "en_US");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", image);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);
  }, [title, description, path, image, type, noindex, locale]);

  useEffect(() => {
    document.getElementById(JSON_LD_ID)?.remove();
    if (!jsonLdText) return;

    const script = document.createElement("script");
    script.id = JSON_LD_ID;
    script.type = "application/ld+json";
    script.textContent = jsonLdText;
    document.head.appendChild(script);

    return () => script.remove();
  }, [jsonLdText]);

  return null;
}
