import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import LocaleSwitcher from "@/components/layout/locale-switcher";
import { useLocale } from "@/lib/locale-context";
import { getTranslations } from "@/lib/translations";

type LocalizedText = { pl?: string; en?: string };
export type Guide = {
  _id: string;
  title?: LocalizedText;
  excerpt?: LocalizedText;
  category?: LocalizedText;
  readingTime?: string;
  imageUrl?: string;
  body?: PortableTextBlock[];
  bodyEn?: PortableTextBlock[];
};

const fallbackImages = [
  "/images/guides/terrarium.png",
  "/images/guides/feeding.png",
  "/images/guides/homecoming.png",
];

function localizedText(value: LocalizedText | undefined, locale: "pl" | "en") {
  return value?.[locale] || (locale === "pl" ? value?.en : "") || "";
}

export function GuidesPage({ guides }: { guides: Guide[] }) {
  const { locale } = useLocale();
  const translations = getTranslations(locale);

  return (
    <main className="guides-page">
      <header className="guides-header">
        <Link to="/" className="text-link dark">
          <ArrowLeft size={15} /> {translations.guides.backHome}
        </Link>
        <Link to="/" className="guides-brand">
          O TY
          <br />
          <em>GADZIE!</em>
        </Link>
        <LocaleSwitcher />
      </header>

      <section className="guides-intro">
        <p className="eyebrow dark">
          <span /> {translations.guides.eyebrow}
        </p>
        <h1>
          {translations.guides.title}
          <br />
          <i>{translations.guides.titleAccent}</i>
        </h1>
        <p>{translations.guides.introduction}</p>
      </section>

      <section
        className="guides-grid"
        aria-label={translations.guides.listLabel}
      >
        {guides.map((guide, index) => (
          <article className="guide-card" key={guide._id}>
            <img
              src={
                guide.imageUrl || fallbackImages[index % fallbackImages.length]
              }
              alt=""
            />
            <div className="guide-card-copy">
              <p className="guide-meta">
                {localizedText(guide.category, locale) ||
                  translations.guides.categoryFallback}
                {guide.readingTime ? ` · ${guide.readingTime}` : ""}
              </p>
              <h2>{localizedText(guide.title, locale)}</h2>
              <p>{localizedText(guide.excerpt, locale)}</p>
              <Link to={`/guides/${guide._id}`} className="text-link dark">
                {translations.guides.readGuide} <ArrowUpRight size={15} />
              </Link>
            </div>
          </article>
        ))}
      </section>

      {guides.length === 0 && (
        <p className="guides-empty">{translations.guides.empty}</p>
      )}
    </main>
  );
}

export function GuideDetailPage({ guide }: { guide: Guide }) {
  const { locale } = useLocale();
  const translations = getTranslations(locale);
  const body = locale === "en" ? guide.bodyEn : guide.body;

  return (
    <main className="guides-page">
      <header className="guides-header">
        <Link to="/guides" className="text-link dark">
          <ArrowLeft size={15} /> {translations.guides.backToGuides}
        </Link>
        <LocaleSwitcher />
      </header>
      <article className="guide-detail">
        <p className="eyebrow dark">
          <span />{" "}
          {localizedText(guide.category, locale) ||
            translations.guides.categoryFallback}
        </p>
        <h1>{localizedText(guide.title, locale)}</h1>
        <p>{localizedText(guide.excerpt, locale)}</p>
        {body && (
          <div className="guide-body">
            <PortableText value={body} />
          </div>
        )}
      </article>
    </main>
  );
}
