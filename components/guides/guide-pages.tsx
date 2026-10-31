import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Eyebrow from "@/components/ui/eyebrow";
import {
  pageShellClassName,
  spacedTextLinkClassName,
} from "@/components/ui/styles";
import LocaleSwitcher from "@/components/layout/locale-switcher";
import { useLocale } from "@/lib/locale-context";
import { getTranslations } from "@/lib/translations";

type LocalizedText = { pl?: string; en?: string };
type GuideImageBlock = {
  _key: string;
  _type: "image";
  assetUrl?: string;
  alt?: string;
  layout?: "full" | "left" | "right";
};
type GuideBodyBlock = PortableTextBlock | GuideImageBlock;
export type Guide = {
  _id: string;
  title?: LocalizedText;
  excerpt?: LocalizedText;
  category?: LocalizedText;
  readingTime?: string;
  imageUrl?: string;
  body?: GuideBodyBlock[];
  bodyEn?: GuideBodyBlock[];
};

const fallbackImages = [
  "/images/guides/terrarium.png",
  "/images/guides/feeding.png",
  "/images/guides/homecoming.png",
];

function localizedText(value: LocalizedText | undefined, locale: "pl" | "en") {
  return value?.[locale] || (locale === "pl" ? value?.en : "") || "";
}

const portableTextComponents: PortableTextComponents<GuideBodyBlock> = {
  types: {
    image: ({ value }) => {
      if (!value.assetUrl) return null;

      return (
        <figure
          className={
            value.layout === "left"
              ? "float-left mt-2 mb-[18px] mr-8 w-[calc(50%-18px)] max-[640px]:float-none max-[640px]:my-7 max-[640px]:w-auto"
              : value.layout === "right"
                ? "float-right mt-2 mb-[18px] ml-8 w-[calc(50%-18px)] max-[640px]:float-none max-[640px]:my-7 max-[640px]:w-auto"
                : "clear-both my-9"
          }
        >
          <img
            src={value.assetUrl}
            alt={value.alt || ""}
            loading="lazy"
            decoding="async"
            className="block max-h-[680px] w-full object-cover"
          />
          {value.alt && (
            <figcaption className="mt-[10px] text-[12px] leading-[1.5] text-muted">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export function GuidesPage({ guides }: { guides: Guide[] }) {
  const { locale } = useLocale();
  const translations = getTranslations(locale);

  return (
    <main className={`${pageShellClassName} pb-[90px]`}>
      <header className="mx-auto flex max-w-[1240px] items-start justify-between">
        <Link to="/" className={`${spacedTextLinkClassName} text-forest`}>
          <ArrowLeft size={15} /> {translations.guides.backHome}
        </Link>

        <LocaleSwitcher />
      </header>

      <section className="mx-auto mt-[130px] mb-20 max-w-[1240px] max-[800px]:mt-[90px] max-[800px]:mb-[55px]">
        <Eyebrow tone="dark">{translations.guides.eyebrow}</Eyebrow>
        <h1 className="mt-5 mb-7 text-[clamp(64px,9vw,144px)] leading-[0.84] tracking-[-0.06em]">
          {translations.guides.title}
          <br />
          <i className="font-normal text-gold">
            {translations.guides.titleAccent}
          </i>
        </h1>
        <p className="max-w-[520px] text-[18px] leading-[1.5]">
          {translations.guides.introduction}
        </p>
      </section>

      <section
        className="mx-auto grid max-w-[1240px] grid-cols-2 gap-[22px] max-[800px]:grid-cols-1"
        aria-label={translations.guides.listLabel}
      >
        {guides.map((guide, index) => (
          <article
            className="grid min-h-[260px] grid-cols-[38%_1fr] bg-sand max-[800px]:grid-cols-[34%_1fr]"
            key={guide._id}
          >
            <img
              src={
                guide.imageUrl || fallbackImages[index % fallbackImages.length]
              }
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div className="flex flex-col items-start p-7 max-[800px]:p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-60">
                {localizedText(guide.category, locale) ||
                  translations.guides.categoryFallback}
                {guide.readingTime ? ` · ${guide.readingTime}` : ""}
              </p>
              <h2 className="mt-5 mb-3 text-[clamp(25px,2.5vw,40px)] leading-[0.95] tracking-[-0.055em]">
                {localizedText(guide.title, locale)}
              </h2>
              <p className="mb-6 leading-[1.45]">
                {localizedText(guide.excerpt, locale)}
              </p>
              <Link
                to={`/guides/${guide._id}`}
                className={`${spacedTextLinkClassName} text-forest`}
              >
                {translations.guides.readGuide} <ArrowUpRight size={15} />
              </Link>
            </div>
          </article>
        ))}
      </section>

      {guides.length === 0 && (
        <p className="mx-auto max-w-[1240px]">{translations.guides.empty}</p>
      )}
    </main>
  );
}

export function GuideDetailPage({ guide }: { guide: Guide }) {
  const { locale } = useLocale();
  const translations = getTranslations(locale);
  const body = locale === "en" ? guide.bodyEn : guide.body;

  return (
    <main className={`${pageShellClassName} pb-[90px]`}>
      <header className="mx-auto flex max-w-[1240px] items-start justify-between">
        <Link to="/guides" className={`${spacedTextLinkClassName} text-forest`}>
          <ArrowLeft size={15} /> {translations.guides.backToGuides}
        </Link>
        <LocaleSwitcher />
      </header>
      <article className="mx-auto mt-[130px] max-w-[820px]">
        <Eyebrow tone="dark">
          {localizedText(guide.category, locale) ||
            translations.guides.categoryFallback}
        </Eyebrow>
        <h1 className="mt-[22px] mb-7 text-[clamp(58px,9vw,132px)] leading-[0.84] tracking-[-0.06em]">
          {localizedText(guide.title, locale)}
        </h1>
        <p className="max-w-[680px] text-[18px] leading-[1.75]">
          {localizedText(guide.excerpt, locale)}
        </p>
        {body && (
          <div className="flow-root max-w-[680px] text-[18px] leading-[1.75] [&_p]:mb-6 [&_p]:leading-[1.75]">
            <PortableText<GuideBodyBlock>
              value={body}
              components={portableTextComponents}
            />
          </div>
        )}
      </article>
    </main>
  );
}
