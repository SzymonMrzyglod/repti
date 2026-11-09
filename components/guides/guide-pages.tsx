import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Eyebrow from "@/components/ui/eyebrow";
import {
  pageShellClassName,
  spacedTextLinkClassName,
} from "@/components/ui/styles";
import LocaleSwitcher from "@/components/layout/locale-switcher";
import {
  LocalizedRichText,
  localizedRichTextPlainText,
  RichText,
  type LocalizedRichTextValue,
} from "@/components/ui/rich-text";
import { useLocale } from "@/lib/locale-context";
import { localizedText, type Localized } from "@/lib/localized";
import { getTranslations } from "@/lib/translations";
import {
  consumeGuidesListScrollRestore,
  saveGuidesListScrollPosition,
} from "@/lib/guides-view-state";

type LocalizedText = Localized;
export type Guide = {
  _id: string;
  title?: LocalizedText;
  excerpt?: LocalizedRichTextValue;
  category?: LocalizedText;
  categoryId?: string;
  speciesId?: string;
  speciesName?: LocalizedText;
  readingTime?: string;
  imageUrl?: string;
  body?: unknown;
  bodyEn?: unknown;
};

const fallbackImages = [
  "/images/guides/terrarium.png",
  "/images/guides/feeding.png",
  "/images/guides/homecoming.png",
];
const guideFilterClassName =
  "flex min-h-10 w-full items-center justify-between gap-3 bg-sand/70 px-3 py-2 text-left font-sans text-[13px] text-ink transition-colors duration-200 hover:bg-sand focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2 motion-reduce:transition-none";

type GuideFilterOption = { id: string; label: string };

function GuideFilterDropdown({
  label,
  value,
  options,
  onChange,
  align = "left",
}: {
  label: string;
  value: string;
  options: GuideFilterOption[];
  onChange: (value: string) => void;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const selectedOption = options.find((option) => option.id === value);
  const activeOption = options[activeIndex];

  const openList = (index = options.findIndex((option) => option.id === value)) => {
    setActiveIndex(Math.max(index, 0));
    setOpen(true);
  };

  const selectOption = (option: GuideFilterOption) => {
    onChange(option.id);
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative w-[170px] max-[700px]:w-full">
      <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
        {label}
      </span>
      <div>
        <button
          ref={triggerRef}
          type="button"
          className={guideFilterClassName}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && activeOption ? `${listId}-${activeOption.id || "all"}` : undefined}
          aria-label={`${label}: ${selectedOption?.label || options[0]?.label || ""}`}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              if (!open) openList();
              else setActiveIndex((index) => (index + 1) % options.length);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              if (!open) openList();
              else setActiveIndex((index) => (index - 1 + options.length) % options.length);
            } else if (event.key === "Home" && open) {
              event.preventDefault();
              setActiveIndex(0);
            } else if (event.key === "End" && open) {
              event.preventDefault();
              setActiveIndex(options.length - 1);
            } else if ((event.key === "Enter" || event.key === " ") && open && activeOption) {
              event.preventDefault();
              selectOption(activeOption);
            }
          }}
        >
          <span className="truncate">
            {selectedOption?.label || options[0]?.label}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 text-gold transition-transform duration-200 ${
              open ? "rotate-180" : ""
            } motion-reduce:transition-none`}
          />
        </button>
        {open && (
          <div
            id={listId}
            role="listbox"
            aria-label={label}
            className={`absolute top-full z-30 mt-2 max-h-60 w-max min-w-full max-w-[calc(100vw-40px)] overflow-y-auto border-t-2 border-gold bg-ivory py-1 shadow-xl ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            {options.map((option, index) => (
              <button
                key={option.id}
                id={`${listId}-${option.id || "all"}`}
                type="button"
                role="option"
                aria-selected={value === option.id}
                tabIndex={-1}
                className={`flex w-full items-center justify-between gap-5 border-0 px-3 py-2.5 text-left text-[13px] transition-colors duration-150 hover:bg-sand focus-visible:bg-sand focus-visible:outline-none motion-reduce:transition-none ${
                  index === activeIndex || value === option.id
                    ? "bg-sand/70 text-forest"
                    : "bg-transparent text-ink"
                }`}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => selectOption(option)}
              >
                <span>{option.label}</span>
                {value === option.id && (
                  <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-gold" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function GuidesPage({ guides }: { guides: Guide[] }) {
  const { locale } = useLocale();
  const translations = getTranslations(locale);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSpeciesId = searchParams.get("species");
  const selectedCategoryId = searchParams.get("category");
  const currentSearch = searchParams.toString();
  const [filtersOpen, setFiltersOpen] = useState(() =>
    window.matchMedia("(min-width: 701px)").matches,
  );
  const filterPanelId = useId();
  const activeFilterCount = Number(Boolean(selectedSpeciesId)) +
    Number(Boolean(selectedCategoryId));

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 701px)");
    const updateDefaultState = (event: MediaQueryListEvent) =>
      setFiltersOpen(event.matches);

    desktopQuery.addEventListener("change", updateDefaultState);
    return () => desktopQuery.removeEventListener("change", updateDefaultState);
  }, []);

  const updateFilter = (name: "species" | "category", value: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    if (value) nextSearchParams.set(name, value);
    else nextSearchParams.delete(name);
    setSearchParams(nextSearchParams);
  };
  const resetFilters = () => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete("species");
    nextSearchParams.delete("category");
    setSearchParams(nextSearchParams);
  };

  useLayoutEffect(() => {
    const scrollY = consumeGuidesListScrollRestore();
    if (scrollY === null) return;

    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    try {
      window.scrollTo(0, scrollY);
    } finally {
      root.style.scrollBehavior = previousScrollBehavior;
    }
  }, []);

  useEffect(() => {
    let frame = 0;
    const saveScrollPosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        saveGuidesListScrollPosition(window.scrollY),
      );
    };

    window.addEventListener("scroll", saveScrollPosition, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", saveScrollPosition);
    };
  }, []);

  const speciesOptions = useMemo(() => {
    const speciesMap = new Map<string, LocalizedText>();

    guides.forEach((guide) => {
      if (guide.speciesId && guide.speciesName) {
        speciesMap.set(guide.speciesId, guide.speciesName);
      }
    });

    return Array.from(speciesMap, ([id, name]) => ({
      id,
      label: localizedText(name, locale),
    }));
  }, [guides, locale]);
  const categoryOptions = useMemo(() => {
    const categoryMap = new Map<string, LocalizedText>();

    guides.forEach((guide) => {
      if (guide.categoryId && guide.category) {
        categoryMap.set(guide.categoryId, guide.category);
      }
    });

    return Array.from(categoryMap, ([id, name]) => ({
      id,
      label: localizedText(name, locale),
    }));
  }, [guides, locale]);
  const filteredGuides = guides.filter(
    (guide) =>
      (!selectedSpeciesId || guide.speciesId === selectedSpeciesId) &&
      (!selectedCategoryId || guide.categoryId === selectedCategoryId),
  );

  return (
    <main className={`${pageShellClassName} pb-[90px]`}>
      <header className="sticky top-0 z-20 -mx-[5vw] bg-ivory/85 px-[5vw] py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-start justify-between">
          <Link to="/" className={`${spacedTextLinkClassName} text-forest`}>
            <ArrowLeft size={15} /> {translations.guides.backHome}
          </Link>

          <LocaleSwitcher />
        </div>
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
        aria-label={translations.guides.listLabel}
        className="mx-auto max-w-[1240px]"
      >
        <div className="mb-7 border-b border-outline pb-5">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              className="inline-flex items-center gap-2 border-0 bg-transparent p-0 text-[10px] font-bold uppercase tracking-[0.12em] text-forest"
              aria-expanded={filtersOpen}
              aria-controls={filterPanelId}
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <SlidersHorizontal aria-hidden="true" size={15} />
              {translations.guides.filters}
              <span
                aria-hidden="true"
                className={`inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[9px] text-forest ${
                  activeFilterCount > 0
                    ? "bg-gold opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                {activeFilterCount}
              </span>
              <ChevronDown
                aria-hidden="true"
                size={14}
                className={`transition-transform duration-200 ${
                  filtersOpen ? "rotate-180" : ""
                } motion-reduce:transition-none`}
              />
            </button>
            {(selectedSpeciesId || selectedCategoryId) && (
              <button
                type="button"
                className="inline-flex items-center gap-1 border-0 bg-transparent p-0 text-[9px] font-mono uppercase tracking-[0.1em] text-muted transition-colors hover:text-forest motion-reduce:transition-none"
                onClick={resetFilters}
              >
                <X aria-hidden="true" size={13} className="text-gold" />
                {translations.guides.resetFilters}
              </button>
            )}
          </div>
          <div
            id={filterPanelId}
            className={`hidden flex-wrap items-end gap-4 max-[700px]:grid-cols-2 ${
              filtersOpen ? "max-[700px]:grid min-[701px]:flex" : ""
            }`}
          >
            <GuideFilterDropdown
              label={translations.guides.speciesFilterLabel}
              value={selectedSpeciesId || ""}
              options={[
                { id: "", label: translations.guides.allSpecies },
                ...speciesOptions,
              ]}
              onChange={(value) => updateFilter("species", value)}
            />
            <GuideFilterDropdown
              label={translations.guides.categoryFilterLabel}
              value={selectedCategoryId || ""}
              align="right"
              options={[
                { id: "", label: translations.guides.allCategories },
                ...categoryOptions,
              ]}
              onChange={(value) => updateFilter("category", value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[22px] max-[800px]:grid-cols-1">
          {filteredGuides.map((guide, index) => (
            <article className="min-h-[260px]" key={guide._id}>
              <Link
                to={`/guides/${guide._id}/${currentSearch ? `?${currentSearch}` : ""}`}
                className="group grid h-full min-h-[260px] grid-cols-[38%_1fr] bg-sand focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4 max-[800px]:grid-cols-[34%_1fr]"
                onClick={() =>
                  saveGuidesListScrollPosition(window.scrollY)
                }
              >
                <img
                  src={
                    guide.imageUrl ||
                    fallbackImages[index % fallbackImages.length]
                  }
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
                />
                <div className="flex min-w-0 flex-col items-start p-7 max-[800px]:p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-60">
                    {guide.speciesName
                      ? localizedText(guide.speciesName, locale)
                      : ""}
                    {guide.speciesName && guide.category ? " · " : ""}
                    {localizedText(guide.category, locale) ||
                      translations.guides.categoryFallback}
                    {guide.readingTime ? ` · ${guide.readingTime}` : ""}
                  </p>
                  <h2 className="mt-5 mb-3 text-[clamp(25px,2.5vw,40px)] leading-[0.95] tracking-[-0.055em]">
                    {localizedText(guide.title, locale)}
                  </h2>
                  <p className="mb-6 line-clamp-3 leading-[1.45]">
                    {localizedRichTextPlainText(guide.excerpt, locale)}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-[14px] border-b border-gold pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-forest">
                    {translations.guides.readGuide} <ArrowUpRight size={15} />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {guides.length === 0 ? (
        <p className="mx-auto max-w-[1240px]">{translations.guides.empty}</p>
      ) : filteredGuides.length === 0 ? (
        <p className="mx-auto mt-8 max-w-[1240px]">
          {translations.guides.speciesEmpty}
        </p>
      ) : null}
    </main>
  );
}

export function GuideDetailPage({ guide }: { guide: Guide }) {
  const { locale } = useLocale();
  const translations = getTranslations(locale);
  const [searchParams] = useSearchParams();
  const currentSearch = searchParams.toString();
  const body = locale === "en" ? guide.bodyEn : guide.body;

  return (
    <main className={`${pageShellClassName} pb-[90px]`}>
      <header className="sticky top-0 z-20 -mx-[5vw] bg-ivory/85 px-[5vw] py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-start justify-between">
          <Link
            to={`/guides/${currentSearch ? `?${currentSearch}` : ""}`}
            className={`${spacedTextLinkClassName} text-forest`}
          >
            <ArrowLeft size={15} /> {translations.guides.backToGuides}
          </Link>
          <LocaleSwitcher />
        </div>
      </header>
      <article className="mx-auto mt-[130px] max-w-[820px]">
        <Eyebrow tone="dark">
          {localizedText(guide.category, locale) ||
            translations.guides.categoryFallback}
        </Eyebrow>
        <h1 className="mt-[22px] mb-7 text-[clamp(58px,9vw,132px)] leading-[0.84] tracking-[-0.06em]">
          {localizedText(guide.title, locale)}
        </h1>
        <LocalizedRichText
          value={guide.excerpt}
          locale={locale}
          className="max-w-[680px] text-[18px] leading-[1.75] [&_p]:mb-6 [&_p]:leading-[1.75]"
        />
        <RichText
          value={body}
          className="guide-body max-w-[680px] text-[18px] leading-[1.75] [&_p]:mb-6 [&_p]:leading-[1.75]"
        />
      </article>
    </main>
  );
}
