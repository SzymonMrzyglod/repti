import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimalCard from "@/components/animals/animal-card";
import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";
import Eyebrow from "@/components/ui/eyebrow";
import {
  outlineButtonClassName,
  spacedTextLinkClassName,
  textLinkClassName,
} from "@/components/ui/styles";
import { useLocale } from "@/lib/locale-context";
import { getTranslations } from "@/lib/translations";
import { saveHomeViewState } from "@/lib/home-view-state";
import { localizedText, type Localized } from "@/lib/localized";

type Animal = {
  id: string;
  name: string;
  species: string;
  latin: string;
  morph: string;
  sex: string;
  weight: string;
  price?: string;
  featured?: boolean;
  status: "available" | "reserved" | "adopted";
  image: string;
};

type SiteSettings = {
  brandName?: string;
  logoUrl?: string;
  heroImageUrl?: string;
  heroEyebrow?: Localized;
  heroTitle?: Localized;
  heroText?: Localized;
  historyEyebrow?: Localized;
  historyTitle?: Localized;
  historyLead?: Localized;
  historyText?: Localized;
  collectionEyebrow?: Localized;
  collectionTitle?: Localized;
  collectionNote?: Localized;
  careEyebrow?: Localized;
  careTitle?: Localized;
  careText?: Localized;
  seoTitle?: Localized;
  seoDescription?: Localized;
};
type HomePageProps = {
  animals: Animal[];
  settings?: SiteSettings | null;
  initialShowAll?: boolean;
  initialFilter?: string;
};

export default function HomePage({
  animals,
  settings,
  initialShowAll = false,
  initialFilter = "all",
}: HomePageProps) {
  const { locale } = useLocale();
  const translations = getTranslations(locale);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState(initialFilter);
  const [showAll, setShowAll] = useState(initialShowAll);

  useEffect(() => {
    saveHomeViewState({ showAll, filter });
  }, [showAll, filter]);

  // Layout effect so the listener is removed in the same commit that leaves the
  // page, before the shorter next page clamps the scroll position to the top.
  useLayoutEffect(() => {
    let frame = 0;
    const saveScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        saveHomeViewState({ scrollY: window.scrollY }),
      );
    };

    window.addEventListener("scroll", saveScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", saveScroll);
    };
  }, []);
  const species = useMemo(
    () =>
      Array.from(
        new Set(animals.map((animal) => animal.species).filter(Boolean)),
      ),
    [animals],
  );
  const filteredAnimals = useMemo(
    () =>
      filter === "all"
        ? animals
        : animals.filter((animal) => animal.species === filter),
    [filter, animals],
  );
  const visibleAnimals = showAll
    ? filteredAnimals
    : filteredAnimals.slice(0, 3);

  const filterOptions = [
    { value: "all", label: translations.home.allAnimals },
    ...species.map((name) => ({ value: name, label: name })),
  ];

  return (
    <main className="overflow-x-clip">
      <section
        className="relative h-svh min-h-[720px] bg-[#16251c] text-[#f3f1e8] max-[700px]:h-auto max-[700px]:min-h-0"
        id="start"
      >
        <img
          src={settings?.heroImageUrl || "/images/hero-gecko.webp"}
          alt={translations.home.heroAlt}
          className="absolute inset-0 h-full w-full object-cover object-[center_37%] saturate-[0.82] max-[700px]:object-[62%_center]"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,20,14,0.82),rgba(11,20,14,0.2)_63%,rgba(10,16,12,0.38)),linear-gradient(0deg,rgba(8,14,11,0.65),transparent_42%)]" />
        <SiteHeader
          menuOpen={menuOpen}
          onToggle={() => setMenuOpen((current) => !current)}
          onNavigate={() => setMenuOpen(false)}
          brandName={settings?.brandName}
          logoUrl={settings?.logoUrl}
        />
        <div className="relative z-[1] max-w-[720px] px-[5.5vw] pt-[18vh] pb-[110px] min-[1000px]:max-[1999px]:pt-[10vh] min-[2000px]:max-w-[1120px] min-[2000px]:pt-[120px] max-[900px]:max-w-[650px] max-[700px]:px-[6vw] max-[700px]:pt-[118px] max-[700px]:pb-[96px]">
          <Eyebrow>
            {localizedText(
              settings?.heroEyebrow,
              locale,
              translations.home.heroEyebrow,
            )}
          </Eyebrow>
          <h1 className="mt-[28px] mb-[30px] max-w-[8ch] text-[clamp(58px,7vw,104px)] leading-[0.86] tracking-[-0.07em] max-[700px]:text-[clamp(58px,18vw,96px)] min-[2000px]:text-[clamp(84px,7vw,132px)]">
            {localizedText(
              settings?.heroTitle,
              locale,
              translations.home.heroTitle,
            )}
          </h1>
          <p className="mb-[35px] max-w-[48ch] text-[14px] leading-[1.7] text-[#d0cec3]">
            {localizedText(
              settings?.heroText,
              locale,
              translations.home.heroText,
            )}
          </p>
          <a href="#animals" className={outlineButtonClassName}>
            {translations.home.discoverAnimals} <ArrowDown size={16} />
          </a>
        </div>
        <div className="pointer-events-none absolute right-[5.5vw] bottom-7 left-[5.5vw] flex justify-between text-[9px] tracking-[0.18em] text-[#b8b8aa] max-[700px]:static max-[700px]:px-[6vw] max-[700px]:pb-6 min-[2000px]:bottom-5 min-[2000px]:mx-auto min-[2000px]:max-w-[1680px]">
          <span>{translations.home.scrollToDiscover}</span>
          <span className="text-[#e9e4d7]">
            01 <i className="mx-2 not-italic text-gold">/</i> 04
          </span>
        </div>
      </section>

      <section className="bg-ivory px-[11vw] pt-[120px] pb-[105px] max-[700px]:px-[7vw] max-[700px]:py-20" id="philosophy">
        <Eyebrow tone="dark">
          {localizedText(
            settings?.historyEyebrow,
            locale,
            translations.home.historyEyebrow,
          )}
        </Eyebrow>
        <div className="mt-[44px] mb-[85px] ml-[7vw] grid max-w-[1000px] grid-cols-2 gap-[7vw] max-[700px]:mt-[35px] max-[700px]:mb-[65px] max-[700px]:ml-0 max-[700px]:grid-cols-1 max-[700px]:gap-[35px]">
          <h2 className="m-0 text-[clamp(50px,6vw,82px)] leading-[0.95] tracking-[-0.055em] text-forest">
            {localizedText(
              settings?.historyTitle,
              locale,
              translations.home.historyTitle,
            )}
          </h2>
          <div className="max-w-[390px] pt-[11px] text-[13px] leading-[1.8] text-[#73766d]">
            <p className="mb-[23px] font-display text-[21px] leading-[1.25] text-ink">
              {localizedText(
                settings?.historyLead,
                locale,
                translations.home.historyLead,
              )}
            </p>
            <p>
              {localizedText(
                settings?.historyText,
                locale,
                translations.home.historyText,
              )}
            </p>
            <a href="#contact" className={`${spacedTextLinkClassName} text-forest`}>
              {translations.home.historyLink} <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-forest px-[5.5vw] pt-[115px] pb-[85px] text-ivory max-[700px]:px-[6vw] max-[700px]:py-20" id="animals">
        <div className="mb-[68px] flex items-end justify-between max-[700px]:mb-[45px] max-[700px]:block">
          <div>
            <Eyebrow>
              {localizedText(
                settings?.collectionEyebrow,
                locale,
                translations.home.collectionEyebrow,
              )}
            </Eyebrow>
            <h2 className="mt-7 mb-0 text-[clamp(50px,6vw,82px)] leading-[0.95] tracking-[-0.055em]">
              {localizedText(
                settings?.collectionTitle,
                locale,
                translations.home.collectionTitle,
              )}
            </h2>
          </div>
          <p className="mb-1 text-[12px] leading-[1.7] text-[#a7afa0] max-[700px]:mt-[25px]">
            {localizedText(
              settings?.collectionNote,
              locale,
              translations.home.collectionNote,
            )}
          </p>
        </div>
        <div className="mb-[27px] flex flex-wrap items-center justify-between gap-5 border-b border-forest-border pb-[17px] max-[700px]:items-start">
          <div className="flex flex-wrap gap-[25px] max-[700px]:gap-3">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`border-0 bg-transparent p-0 text-[10px] uppercase tracking-[0.1em] text-[#89978a] max-[700px]:text-[8px] ${filter === option.value ? "text-gold" : ""}`}
                onClick={() => {
                  setFilter(option.value);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-[18px] max-[900px]:grid-cols-2 max-[700px]:grid-cols-1">
          {visibleAnimals.map((animal) => (
            <AnimalCard animal={animal} key={animal.id} />
          ))}
        </div>
        <div className="mt-[55px] flex items-center justify-between text-[10px] text-[#819184]">
          <span>
            {String(
              Math.min(visibleAnimals.length, filteredAnimals.length),
            ).padStart(2, "0")}{" "}
            / {String(filteredAnimals.length).padStart(2, "0")}
          </span>
          {filteredAnimals.length > 3 && (
            <button
              type="button"
              className={`${textLinkClassName} mt-0 cursor-pointer border-x-0 border-t-0 bg-transparent text-[#e5e0d2]`}
              onClick={() => setShowAll((current) => !current)}
            >
              {showAll ? translations.home.showLess : translations.home.showAll}{" "}
              <ArrowUpRight size={15} />
            </button>
          )}
        </div>
      </section>

      <section className="flex min-h-[580px] items-center bg-[linear-gradient(90deg,rgba(15,34,24,0.94),rgba(15,34,24,0.7)),url('/images/hero-gecko.webp')] bg-cover bg-[center_49%] text-ivory" id="care">
        <div className="max-w-[680px] px-[11vw] py-20 max-[700px]:px-[7vw]">
          <Eyebrow>
            {localizedText(
              settings?.careEyebrow,
              locale,
              translations.home.careEyebrow,
            )}
          </Eyebrow>
          <h2 className="my-7 text-[clamp(50px,6vw,82px)] leading-[0.95] tracking-[-0.055em]">
            {localizedText(
              settings?.careTitle,
              locale,
              translations.home.careTitle,
            )}
          </h2>
          <p className="mb-[30px] max-w-[350px] text-[13px] leading-[1.75] text-[#b8c0b2]">
            {localizedText(
              settings?.careText,
              locale,
              translations.home.careText,
            )}
          </p>
          <Link to="/guides" className={outlineButtonClassName}>
            {translations.home.guidesLink} <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <SiteFooter logoUrl={settings?.logoUrl} />
    </main>
  );
}
