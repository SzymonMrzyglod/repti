import { useEffect, useRef } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
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
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuStateClassName = menuOpen
    ? "max-[700px]:visible max-[700px]:max-h-[400px] max-[700px]:pointer-events-auto max-[700px]:py-[25px] max-[700px]:opacity-100"
    : "max-[700px]:pointer-events-none max-[700px]:invisible max-[700px]:max-h-0 max-[700px]:py-0 max-[700px]:opacity-0";

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        !navRef.current?.contains(target) &&
        !menuButtonRef.current?.contains(target)
      ) {
        onNavigate();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointerDown);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsidePointerDown);
  }, [menuOpen, onNavigate]);

  return (
    <header className="relative z-[2] flex items-center justify-between gap-x-[clamp(24px,4vw,64px)] border-b border-[rgba(245,241,229,0.2)] px-[5.5vw] py-3 max-[900px]:px-[6vw] max-[700px]:gap-x-4 max-[700px]:px-[6vw]">
      <a
        href="#start"
        className="flex items-center gap-[11px] text-[12px] font-bold leading-[0.92] tracking-[0.17em]"
        aria-label={`${brandName} — ${translations.navigation.homePage}`}
      >
        <BrandMark logoUrl={logoUrl} />
      </a>
      <nav id="mobile-navigation" ref={navRef} className={`ml-auto mr-[5vw] flex gap-[clamp(20px,3.2vw,54px)] text-[11px] uppercase tracking-[0.15em] text-[#d7d5c9] [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-gold [&_a]:motion-reduce:transition-none max-[900px]:mr-[2vw] max-[900px]:gap-[18px] max-[700px]:absolute max-[700px]:right-0 max-[700px]:top-[calc(100%+1px)] max-[700px]:left-0 max-[700px]:m-0 max-[700px]:flex-col max-[700px]:overflow-hidden max-[700px]:bg-forest max-[700px]:px-[6vw] max-[700px]:[transition:max-height_200ms_ease,opacity_200ms_ease,padding_200ms_ease,visibility_200ms_ease] max-[700px]:motion-reduce:transition-none ${mobileMenuStateClassName}`}>
        <a href="#philosophy" onClick={onNavigate}>
          {translations.navigation.philosophy}
        </a>
        <a href="#animals" onClick={onNavigate}>
          {translations.navigation.animals}
        </a>
        <a href="#care" onClick={onNavigate}>
          {translations.navigation.care}
        </a>
        <Link to="/guides" onClick={onNavigate}>
          {translations.navigation.guides}
        </Link>
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
        ref={menuButtonRef}
        type="button"
        className="hidden border-0 bg-transparent text-white max-[700px]:block"
        onClick={onToggle}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
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
