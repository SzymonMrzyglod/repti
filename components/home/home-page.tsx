import { useMemo, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimalCard from "@/components/animals/animal-card";
import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";
import { useLocale } from "@/lib/locale-context";
import { getTranslations } from "@/lib/translations";

type Animal = {
  id: string;
  name: string;
  species: string;
  latin: string;
  morph: string;
  sex: string;
  weight: string;
  status: "available" | "reserved" | "adopted";
  image: string;
};

type Localized = { pl?: string; en?: string };
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
};
type HomePageProps = { animals: Animal[]; settings?: SiteSettings | null };

function localizedText(
  value: Localized | undefined,
  locale: "pl" | "en",
  fallback: string,
) {
  return value?.[locale] || (locale === "pl" ? value?.en : "") || fallback;
}

export default function HomePage({ animals, settings }: HomePageProps) {
  const { locale } = useLocale();
  const translations = getTranslations(locale);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);
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
    <main className="site-shell">
      <section className="hero" id="start">
        <img
          src={settings?.heroImageUrl || "/images/hero-gecko.png"}
          alt={translations.home.heroAlt}
          className="hero-image"
        />
        <div className="hero-overlay" />
        <SiteHeader
          menuOpen={menuOpen}
          onToggle={() => setMenuOpen((current) => !current)}
          onNavigate={() => setMenuOpen(false)}
          brandName={settings?.brandName}
          logoUrl={settings?.logoUrl}
        />
        <div className="hero-content">
          <p className="eyebrow">
            <span />
            {localizedText(
              settings?.heroEyebrow,
              locale,
              translations.home.heroEyebrow,
            )}
          </p>
          <h1>
            {localizedText(
              settings?.heroTitle,
              locale,
              translations.home.heroTitle,
            )}
          </h1>
          <p className="hero-text">
            {localizedText(
              settings?.heroText,
              locale,
              translations.home.heroText,
            )}
          </p>
          <a href="#animals" className="outline-button">
            {translations.home.discoverAnimals} <ArrowDown size={16} />
          </a>
        </div>
        <div className="hero-foot">
          <span>{translations.home.scrollToDiscover}</span>
          <span className="hero-index">
            01 <i>/</i> 04
          </span>
        </div>
      </section>

      <section className="intro-section" id="philosophy">
        <p className="eyebrow dark">
          <span />
          {localizedText(
            settings?.historyEyebrow,
            locale,
            translations.home.historyEyebrow,
          )}
        </p>
        <div className="intro-grid">
          <h2>
            {localizedText(
              settings?.historyTitle,
              locale,
              translations.home.historyTitle,
            )}
          </h2>
          <div>
            <p className="lead">
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
            <a href="#contact" className="text-link">
              {translations.home.historyLink} <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
        <div className="numbers">
          <div>
            <strong>7</strong>
            <span>{translations.home.yearsExperience}</span>
          </div>
          <div>
            <strong>38</strong>
            <span>{translations.home.animalsCaredFor}</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>{translations.home.commitment}</span>
          </div>
        </div>
      </section>

      <section className="catalog-section" id="animals">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span />
              {localizedText(
                settings?.collectionEyebrow,
                locale,
                translations.home.collectionEyebrow,
              )}
            </p>
            <h2>
              {localizedText(
                settings?.collectionTitle,
                locale,
                translations.home.collectionTitle,
              )}
            </h2>
          </div>
          <p className="section-note">
            {localizedText(
              settings?.collectionNote,
              locale,
              translations.home.collectionNote,
            )}
          </p>
        </div>
        <div className="filter-row">
          <div className="filters">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={filter === option.value ? "filter active" : "filter"}
                onClick={() => {
                  setFilter(option.value);
                  setShowAll(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="animal-grid">
          {visibleAnimals.map((animal) => (
            <AnimalCard animal={animal} key={animal.id} />
          ))}
        </div>
        <div className="catalog-foot">
          <span>
            {String(
              Math.min(visibleAnimals.length, filteredAnimals.length),
            ).padStart(2, "0")}{" "}
            / {String(filteredAnimals.length).padStart(2, "0")}
          </span>
          {filteredAnimals.length > 3 && (
            <button
              type="button"
              className="text-link light collection-link"
              onClick={() => setShowAll((current) => !current)}
            >
              {showAll ? translations.home.showLess : translations.home.showAll}{" "}
              <ArrowUpRight size={15} />
            </button>
          )}
        </div>
      </section>

      <section className="care-section" id="care">
        <div className="care-inner">
          <p className="eyebrow">
            <span />
            {localizedText(
              settings?.careEyebrow,
              locale,
              translations.home.careEyebrow,
            )}
          </p>
          <h2>
            {localizedText(
              settings?.careTitle,
              locale,
              translations.home.careTitle,
            )}
          </h2>
          <p>
            {localizedText(
              settings?.careText,
              locale,
              translations.home.careText,
            )}
          </p>
          <Link to="/guides" className="outline-button">
            {translations.home.guidesLink} <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <SiteFooter logoUrl={settings?.logoUrl} />
    </main>
  );
}
