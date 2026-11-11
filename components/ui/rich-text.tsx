import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { ReactNode } from "react";

type RichImageBlock = {
  _key: string;
  _type: "image";
  assetUrl?: string;
  asset?: { _ref?: string };
  alt?: string;
  layout?: "full" | "left" | "right";
};

type RichTextBlock = PortableTextBlock | RichImageBlock;
export type LocalizedRichTextValue = {
  pl?: unknown;
  en?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRichTextBlock(value: unknown): value is RichTextBlock {
  if (!isRecord(value) || typeof value._key !== "string") return false;
  if (value._type === "image") {
    return (
      typeof value.assetUrl === "string" ||
      (isRecord(value.asset) && typeof value.asset._ref === "string")
    );
  }
  return value._type === "block" && Array.isArray(value.children);
}

function getImageUrl(value: RichImageBlock) {
  if (value.assetUrl) return value.assetUrl;
  const reference = value.asset?._ref;
  const match =
    typeof reference === "string" &&
    /^image-([a-f0-9]+)-(\d+x\d+)-([a-z0-9]+)$/i.exec(reference);

  return match
    ? `https://cdn.sanity.io/images/t5to691s/production/${match[1]}-${match[2]}.${match[3]}?auto=format&fit=max&w=1800&q=85`
    : undefined;
}

const components: PortableTextComponents<RichTextBlock> = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 leading-[inherit]">{children}</p>
    ),
    h2: ({ children }) => (
      <h3 className="mt-9 mb-4 font-display text-3xl leading-tight tracking-tight">
        {children}
      </h3>
    ),
    h3: ({ children }) => (
      <h4 className="mt-8 mb-4 font-display text-2xl leading-tight tracking-tight">
        {children}
      </h4>
    ),
    h4: ({ children }) => (
      <h5 className="mt-7 mb-3 font-display text-xl leading-tight">
        {children}
      </h5>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-gold pl-6 italic text-muted">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-6 list-disc space-y-2 pl-8 marker:text-gold">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 list-decimal space-y-2 pl-8 marker:font-semibold marker:text-gold">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.openInNewTab ? "_blank" : undefined}
        rel={value?.openInNewTab ? "noopener noreferrer" : undefined}
        className="text-forest underline decoration-gold underline-offset-4 hover:text-forest-2"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="rounded bg-sand px-1.5 py-0.5 font-mono text-[0.9em]">
        {children}
      </code>
    ),
  },
  types: {
    image: ({ value }) => {
      const imageUrl = getImageUrl(value);
      if (!imageUrl) return null;

      const layout = value.layout ?? "full";
      return (
        <figure
          className={
            layout === "left"
              ? "guide-image-left float-left mt-2 mb-[18px] mr-8 w-[calc(50%-18px)] max-[640px]:float-none max-[640px]:mx-auto max-[640px]:my-7 max-[640px]:w-[95%] max-[640px]:max-w-[480px]"
              : layout === "right"
                ? "guide-image-right float-right mt-2 mb-[18px] ml-8 w-[calc(50%-18px)] max-[640px]:float-none max-[640px]:mx-auto max-[640px]:my-7 max-[640px]:w-[95%] max-[640px]:max-w-[480px]"
                : "clear-both my-9"
          }
        >
          <img
            src={imageUrl}
            alt={value.alt || ""}
            loading="lazy"
            decoding="async"
            className="block max-h-[680px] w-full object-cover"
          />
          {value.alt && (
            <figcaption className="mt-[10px] text-[14px] min-[701px]:text-[16px] leading-[1.5] text-muted">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

function plainText(blocks: unknown) {
  if (typeof blocks === "string") return blocks;
  if (!Array.isArray(blocks)) return "";

  return blocks
    .filter(isRecord)
    .filter((block) => block._type === "block" && Array.isArray(block.children))
    .map((block) =>
      (block.children as unknown[])
        .filter(isRecord)
        .map((child) =>
          typeof child.text === "string" ? child.text : "",
        )
        .join(""),
    )
    .filter(Boolean)
    .join("\n");
}

export function localizedRichTextPlainText(
  value: LocalizedRichTextValue | undefined,
  locale: "pl" | "en",
  fallback = "",
) {
  if (!value) return fallback;
  const current = plainText(value[locale]);
  const alternate = locale === "pl" ? plainText(value.en) : "";
  return current || alternate || fallback;
}

export function RichText({
  value,
  className,
  fallback,
}: {
  value: unknown;
  className?: string;
  fallback?: string;
}) {
  let content: ReactNode = null;
  if (typeof value === "string" && value) {
    content = <p className="mb-6 leading-[inherit]">{value}</p>;
  } else if (Array.isArray(value)) {
    const blocks = value.filter(isRichTextBlock);
    if (blocks.length) {
      content = (
        <PortableText<RichTextBlock>
          value={blocks}
          components={components}
        />
      );
    }
  }
  if (!content && fallback) {
    content = <p className="mb-6 leading-[inherit]">{fallback}</p>;
  }

  return (
    <div className={`rich-text flow-root ${className ?? ""}`.trim()}>
      {content}
    </div>
  );
}

export function LocalizedRichText({
  value,
  locale,
  className,
  fallback,
}: {
  value: LocalizedRichTextValue | undefined;
  locale: "pl" | "en";
  className?: string;
  fallback?: string;
}) {
  const current = value?.[locale];
  const alternate = locale === "pl" ? value?.en : undefined;
  return (
    <RichText
      value={current || alternate}
      className={className}
      fallback={fallback}
    />
  );
}
