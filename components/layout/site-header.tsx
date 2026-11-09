import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
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
  const [compact, setCompact] = useState(false);
  const mobileMenuStateClassName = menuOpen
    ? "max-[700px]:visible max-[700px]:max-h-[400px] max-[700px]:pointer-events-auto max-[700px]:py-[25px] max-[700px]:opacity-100"
    : "max-[700px]:pointer-events-none max-[700px]:invisible max-[700px]:max-h-0 max-[700px]:py-0 max-[700px]:opacity-0";

  useEffect(() => {
    const updateCompact = () => setCompact(window.scrollY > 40);
    updateCompact();
    window.addEventListener("scroll", updateCompact, { passive: true });
    return () => window.removeEventListener("scroll", updateCompact);
  }, []);

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
    <header className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-x-[clamp(24px,4vw,64px)] border-b px-[5.5vw] transition-[background-color,padding] duration-300 max-[900px]:px-[6vw] max-[700px]:gap-x-4 max-[700px]:px-[6vw] ${
      compact
        ? "border-white/10 bg-forest/85 py-1.5 shadow-md backdrop-blur"
        : "border-[rgba(245,241,229,0.2)] bg-transparent py-3"
    } motion-reduce:transition-none`}>
      <a
        href="#start"
        className="flex items-center gap-[11px] text-[12px] font-bold leading-[0.92] tracking-[0.17em]"
        aria-label={`${brandName} — ${translations.navigation.homePage}`}
      >
        <BrandMark logoUrl={logoUrl} compact={compact} />
      </a>
      <nav id="mobile-navigation" ref={navRef} className={`ml-auto mr-[5vw] flex gap-[clamp(20px,3.2vw,54px)] text-[11px] uppercase tracking-[0.15em] text-[#d7d5c9] [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-gold [&_a]:motion-reduce:transition-none max-[900px]:mr-[2vw] max-[900px]:gap-[18px] max-[700px]:absolute max-[700px]:right-0 max-[700px]:top-[calc(100%+1px)] max-[700px]:left-0 max-[700px]:m-0 max-[700px]:flex-col max-[700px]:overflow-hidden max-[700px]:bg-forest/[0.98] max-[700px]:backdrop-blur max-[700px]:px-[6vw] max-[700px]:[transition:max-height_200ms_ease,opacity_200ms_ease,padding_200ms_ease,visibility_200ms_ease] max-[700px]:motion-reduce:transition-none ${mobileMenuStateClassName}`}>
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
      <LocaleSwitcher variant="dark" />
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
