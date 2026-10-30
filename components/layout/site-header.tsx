import { ArrowUpRight, Menu, X } from "lucide-react";
import BrandMark from "./brand-mark";
import { useLocale } from "@/lib/locale-context";
import { getTranslations } from "@/lib/translations";

export default function SiteHeader({
  menuOpen,
  onToggle,
  onNavigate,
  brandName = "O ty gadzie!",
  logoUrl,
}: {
  menuOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  brandName?: string;
  logoUrl?: string;
}) {
  const { locale, setLocale } = useLocale();
  const translations = getTranslations(locale);

  return (
    <header className="site-header">
      <a
        href="#start"
        className="logo"
        aria-label={`${brandName} — ${translations.navigation.homePage}`}
      >
        <BrandMark logoUrl={logoUrl} />
      </a>
      <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
        <a href="#animals" onClick={onNavigate}>
          {translations.navigation.animals}
        </a>
        <a href="#philosophy" onClick={onNavigate}>
          {translations.navigation.philosophy}
        </a>
        <a href="#care" onClick={onNavigate}>
          {translations.navigation.care}
        </a>
        <a href="#contact" onClick={onNavigate}>
          {translations.navigation.contact}
        </a>
      </nav>
      <div className="header-actions">
        <div
          className="language-switcher"
          aria-label={translations.navigation.chooseLanguage}
        >
          <button
            type="button"
            className={locale === "pl" ? "active" : ""}
            onClick={() => setLocale("pl")}
          >
            PL
          </button>
          <button
            type="button"
            className={locale === "en" ? "active" : ""}
            onClick={() => setLocale("en")}
          >
            EN
          </button>
        </div>
        <a href="#contact" className="header-cta">
          {translations.navigation.askAvailability} <ArrowUpRight size={15} />
        </a>
      </div>
      <button
        type="button"
        className="mobile-menu"
        onClick={onToggle}
        aria-label={
          menuOpen
            ? translations.navigation.closeMenu
            : translations.navigation.openMenu
        }
      >
        {menuOpen ? <X /> : <Menu />}
      </button>
    </header>
  );
}
