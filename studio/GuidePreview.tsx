import { useState } from "react";
import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { ComponentProps } from "react";
import type { UserViewComponent } from "sanity/structure";
import "./GuidePreview.css";

type GuideImageBlock = {
  _key: string;
  _type: "image";
  asset: { _ref: string };
  alt?: string;
  layout?: "full" | "left" | "right";
};

type GuideBodyBlock = PortableTextBlock | GuideImageBlock;
type Locale = "pl" | "en";
type RecordValue = Record<string, unknown>;
type GuidePreviewProps = ComponentProps<UserViewComponent>;

function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isGuideBodyBlock(value: unknown): value is GuideBodyBlock {
  if (!isRecord(value) || typeof value._key !== "string") return false;

  if (value._type === "image") {
    return isRecord(value.asset) && typeof value.asset._ref === "string";
  }

  if (value._type !== "block" || !Array.isArray(value.children)) return false;
  return value.children.every(
    (child) =>
      isRecord(child) &&
      typeof child._key === "string" &&
      typeof child._type === "string",
  );
}

function getText(value: unknown, locale: Locale): string {
  if (!isRecord(value)) return "";
  const localizedValue = value[locale];
  return typeof localizedValue === "string" ? localizedValue : "";
}

function getImageUrl(value: unknown): string | undefined {
  if (!isRecord(value) || !isRecord(value.asset)) return undefined;
  const reference = value.asset._ref;
  if (typeof reference !== "string") return undefined;

  const match = /^image-([a-f0-9]+)-(\d+x\d+)-([a-z0-9]+)$/i.exec(reference);
  if (!match) return undefined;

  return `https://cdn.sanity.io/images/t5to691s/production/${match[1]}-${match[2]}.${match[3]}?auto=format&fit=max&w=1800&q=85`;
}

const previewComponents: PortableTextComponents<GuideBodyBlock> = {
  block: {
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <span className="guide-preview-underline">{children}</span>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.openInNewTab ? "_blank" : undefined}
        rel={value?.openInNewTab ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    code: ({ children }) => <code>{children}</code>,
  },
  types: {
    image: ({ value }) => {
      const imageUrl = getImageUrl(value);
      if (!imageUrl) return null;

      const layout = value.layout ?? "full";
      return (
        <figure className={`guide-preview-image guide-preview-image--${layout}`}>
          <img src={imageUrl} alt={value.alt ?? ""} />
          {value.alt && <figcaption>{value.alt}</figcaption>}
        </figure>
      );
    },
  },
};

export default function GuidePreview({ document }: GuidePreviewProps) {
  const [locale, setLocale] = useState<Locale>("pl");
  const displayedGuide = document.displayed;
  const title = getText(displayedGuide.title, locale);
  const excerptValue = displayedGuide.excerpt;
  const excerptContent = isRecord(excerptValue) ? excerptValue[locale] : undefined;
  const excerpt =
    typeof excerptContent === "string" ? excerptContent : undefined;
  const excerptBlocks = Array.isArray(excerptContent)
    ? excerptContent.filter(isGuideBodyBlock)
    : [];
  const bodyValue = displayedGuide[locale === "en" ? "bodyEn" : "body"];
  const body = Array.isArray(bodyValue) ? bodyValue.filter(isGuideBodyBlock) : [];

  return (
    <div className="guide-preview">
      <div className="guide-preview-toolbar">
        <span>Podgląd poradnika</span>
        <div className="guide-preview-languages" aria-label="Język podglądu">
          <button
            type="button"
            aria-pressed={locale === "pl"}
            onClick={() => setLocale("pl")}
          >
            PL
          </button>
          <button
            type="button"
            aria-pressed={locale === "en"}
            onClick={() => setLocale("en")}
          >
            EN
          </button>
        </div>
      </div>
      <main className="guide-preview-page">
        <article className="guide-preview-article">
          <p className="guide-preview-eyebrow">
            {locale === "pl" ? "PORADNIK" : "GUIDE"}
          </p>
          <h1>{title || (locale === "pl" ? "Tytuł poradnika" : "Guide title")}</h1>
          {excerptBlocks.length > 0 ? (
            <div className="guide-preview-excerpt">
              <PortableText
                value={excerptBlocks}
                components={previewComponents}
              />
            </div>
          ) : excerpt ? (
            <p className="guide-preview-excerpt">{excerpt}</p>
          ) : null}
          {body.length > 0 ? (
            <div className="guide-preview-body">
              <PortableText value={body} components={previewComponents} />
            </div>
          ) : (
            <p className="guide-preview-empty">
              {locale === "pl"
                ? "Treść poradnika pojawi się tutaj."
                : "The guide content will appear here."}
            </p>
          )}
        </article>
      </main>
    </div>
  );
}
