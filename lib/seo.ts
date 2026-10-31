export const SITE_URL = "https://o-ty-gadzie.pl";
export const SITE_NAME = "O ty gadzie!";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hero-gecko.webp`;

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function truncate(text: string, max = 160) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}
