import { useLocale } from "@/lib/locale-context";
import { getTranslations } from "@/lib/translations";

export default function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();
  const translations = getTranslations(locale);

  return (
    <div
      className="language-switcher"
      aria-label={translations.navigation.chooseLanguage}
    >
      <button
        type="button"
        className={locale === "pl" ? "active" : ""}
        aria-pressed={locale === "pl"}
        onClick={() => setLocale("pl")}
      >
        PL
      </button>
      <button
        type="button"
        className={locale === "en" ? "active" : ""}
        aria-pressed={locale === "en"}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
    </div>
  );
}
