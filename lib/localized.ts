export type Localized = { pl?: string; en?: string };

// Polish content may fall back to English; English never falls back to Polish.
export function localizedText(
  value: Localized | undefined,
  locale: "pl" | "en",
  fallback = "",
) {
  return value?.[locale] || (locale === "pl" ? value?.en : undefined) || fallback;
}
