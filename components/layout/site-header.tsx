import { ArrowUpRight, Menu, X } from "lucide-react";
import BrandMark from "./brand-mark";
import LocaleSwitcher from "./locale-switcher";
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
  const { locale } = useLocale();
  const translations = getTranslations(locale);
  const mobileMenuStateClassName = menuOpen
    ? "max-[700px]:visible max-[700px]:pointer-events-auto max-[700px]:translate-y-0 max-[700px]:opacity-100"
    : "max-[700px]:pointer-events-none max-[700px]:invisible max-[700px]:translate-y-[-8px] max-[700px]:opacity-0";

  return (
    <header className="relative z-[2] flex items-center justify-between border-b border-[rgba(245,241,229,0.2)] px-[5.5vw] py-3 max-[900px]:px-[6vw] max-[700px]:px-[6vw]">
      <a
        href="#start"
        className="flex items-center gap-[11px] text-[12px] font-bold leading-[0.92] tracking-[0.17em]"
        aria-label={`${brandName} — ${translations.navigation.homePage}`}
      >
        <BrandMark logoUrl={logoUrl} />
      </a>
      <nav className={`ml-auto mr-[5vw] flex gap-[clamp(20px,3.2vw,54px)] text-[11px] uppercase tracking-[0.15em] text-[#d7d5c9] [&_a:hover]:text-gold max-[900px]:mr-[2vw] max-[900px]:gap-[18px] max-[700px]:absolute max-[700px]:right-0 max-[700px]:top-[calc(100%+1px)] max-[700px]:left-0 max-[700px]:m-0 max-[700px]:flex-col max-[700px]:bg-forest max-[700px]:px-[6vw] max-[700px]:py-[25px] max-[700px]:[transition:opacity_180ms_ease,transform_180ms_ease] max-[700px]:motion-reduce:transition-none ${mobileMenuStateClassName}`}>
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
      <div className="flex items-center gap-[22px]">
        <LocaleSwitcher variant="dark" />
        <a href="#contact" className="flex items-center gap-[9px] text-[10px] uppercase tracking-[0.12em] text-[#dad6c8] max-[700px]:hidden">
          {translations.navigation.askAvailability} <ArrowUpRight size={15} />
        </a>
      </div>
      <button
        type="button"
        className="hidden border-0 bg-transparent text-white max-[700px]:block"
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
