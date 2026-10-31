import { useLocale } from "@/lib/locale-context";
import { getTranslations } from "@/lib/translations";

type LocaleSwitcherProps = {
  variant?: "light" | "dark";
};

export default function LocaleSwitcher({
  variant = "light",
}: LocaleSwitcherProps) {
  const { locale, setLocale } = useLocale();
  const translations = getTranslations(locale);

  return (
    <div
      className="flex gap-1"
      role="group"
      aria-label={translations.navigation.chooseLanguage}
    >
      {(["pl", "en"] as const).map((language) => {
        const isActive = locale === language;

        return (
          <button
            key={language}
            type="button"
            className={`border px-[7px] py-[6px] text-[9px] tracking-[0.12em] ${
              isActive
                ? "border-gold bg-gold text-forest"
                : variant === "dark"
                  ? "border-white/30 bg-transparent text-[#b9b39f] hover:border-gold hover:bg-gold hover:text-forest"
                  : "border-ink/30 bg-transparent text-ink hover:border-gold hover:bg-gold hover:text-forest"
            }`}
            aria-pressed={isActive}
            onClick={() => setLocale(language)}
          >
            {language.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
