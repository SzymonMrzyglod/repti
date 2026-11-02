import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
} from "lucide-react";
import LocaleSwitcher from "@/components/layout/locale-switcher";
import { ContactFormModal } from "@/components/contact/contact-form";
import Eyebrow from "@/components/ui/eyebrow";
import {
  outlineButtonClassName,
  pageShellClassName,
  spacedTextLinkClassName,
} from "@/components/ui/styles";
import { useLocale } from "@/lib/locale-context";
import { localizedText, type Localized } from "@/lib/localized";
import { getTranslations } from "@/lib/translations";

type AnimalDetailProps = {
  animal: {
    _id?: string;
    name?: Localized;
    species?: string;
    speciesLatinName?: string;
    latinName?: string;
    morph?: Localized;
    sex?: Localized;
    weight?: string;
    status?: string;
    description?: Localized;
    price?: string;
    imageUrl?: string;
    galleryUrls?: string[];
  };
};
const text = localizedText;

// Gallery URLs are Sanity CDN links with a width param; the lightbox asks for a larger rendition.
const zoomImageUrl = (url: string) => url.replace(/([?&]w=)\d+/, (_, prefix) => `${prefix}3200`);

function useSwipe(onSwipe: (direction: 1 | -1) => void) {
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);

  return {
    didMove: () => movedRef.current,
    handlers: {
      onPointerDown: (event: React.PointerEvent) => {
        movedRef.current = false;
        if (event.pointerType === "touch" && event.isPrimary) {
          startRef.current = { x: event.clientX, y: event.clientY };
        }
      },
      onPointerUp: (event: React.PointerEvent) => {
        const start = startRef.current;
        startRef.current = null;
        if (!start) return;

        const deltaX = event.clientX - start.x;
        const deltaY = event.clientY - start.y;
        movedRef.current = Math.hypot(deltaX, deltaY) > 10;
        if (Math.abs(deltaX) >= 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
          onSwipe(deltaX < 0 ? 1 : -1);
        }
      },
      onPointerCancel: () => {
        startRef.current = null;
      },
    },
  };
}

export default function AnimalDetail({ animal }: AnimalDetailProps) {
  const { locale } = useLocale();
  const translations = getTranslations(locale);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const closeZoomRef = useRef<HTMLButtonElement>(null);
  const images = Array.from(
    new Set([animal.imageUrl, ...(animal.galleryUrls || [])].filter(Boolean)),
  ) as string[];
  const currentImageIndex = Math.min(
    activeImageIndex,
    Math.max(images.length - 1, 0),
  );
  const currentImage = images[currentImageIndex];
  const showImage = (direction: 1 | -1) =>
    setActiveImageIndex(
      (currentImageIndex + direction + images.length) % images.length,
    );
  const handleSwipe = (direction: 1 | -1) => {
    if (images.length > 1) showImage(direction);
  };
  const gallerySwipe = useSwipe(handleSwipe);
  const zoomSwipe = useSwipe(handleSwipe);
  const animalName = text(animal.name, locale, translations.animal.unnamed);
  const status =
    animal.status === "reserved"
      ? "reserved"
      : animal.status === "adopted"
        ? "adopted"
        : "available";

  useEffect(() => {
    setActiveImageIndex(0);
    setZoomOpen(false);
  }, [animal._id]);

  useEffect(() => {
    if (!zoomOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeZoomRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [zoomOpen]);

  useEffect(() => {
    if (!zoomOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomOpen(false);
      if (event.key === "ArrowLeft") handleSwipe(-1);
      if (event.key === "ArrowRight") handleSwipe(1);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  return (
    <main className={`${pageShellClassName} pb-20 max-[800px]:pt-[18px] max-[800px]:pb-12`}>
      <header className="mx-auto mb-16 flex max-w-[1240px] items-center justify-between max-[800px]:mb-9">
        <Link to="/#animals" className={`${spacedTextLinkClassName} text-forest`}>
          <ArrowLeft size={15} /> {translations.animal.backToCollection}
        </Link>
        <LocaleSwitcher />
      </header>
      <section className="mx-auto grid max-w-[1240px] grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] items-center gap-[clamp(40px,7vw,120px)] max-[800px]:grid-cols-1 max-[800px]:gap-[34px]">
        <div
          className="relative aspect-[4/3] touch-pan-y overflow-hidden bg-[#26352a]"
          {...gallerySwipe.handlers}
        >
          {currentImage ? (
            <button
              type="button"
              className="group relative block h-full w-full cursor-zoom-in border-0 bg-transparent p-0"
              aria-label={translations.animal.enlargePhoto}
              onClick={() => {
                if (!gallerySwipe.didMove()) setZoomOpen(true);
              }}
            >
              <img
                src={currentImage}
                alt={`${text(animal.name, locale, translations.animal.unnamed)} (${currentImageIndex + 1} ${translations.animal.photoOf} ${images.length})`}
                className="block h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
                draggable={false}
                fetchPriority="high"
                decoding="async"
              />
              <span className="pointer-events-none absolute top-4 right-4 inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.6)] bg-[rgba(15,31,22,0.65)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-colors group-hover:bg-[rgba(15,31,22,0.9)]">
                <ZoomIn size={16} aria-hidden="true" />
                {translations.animal.enlargePhoto}
              </span>
            </button>
          ) : (
            <div className="h-full w-full bg-[linear-gradient(145deg,#253a2a,#8d9a75)]" />
          )}
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="absolute top-1/2 left-4 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[rgba(255,255,255,0.6)] bg-[rgba(15,31,22,0.55)] text-white hover:bg-[rgba(15,31,22,0.85)]"
                aria-label={translations.animal.previousPhoto}
                onClick={() => showImage(-1)}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="absolute top-1/2 right-4 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[rgba(255,255,255,0.6)] bg-[rgba(15,31,22,0.55)] text-white hover:bg-[rgba(15,31,22,0.85)]"
                aria-label={translations.animal.nextPhoto}
                onClick={() => showImage(1)}
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between font-mono text-[10px] text-white [text-shadow:0_1px_5px_rgba(0,0,0,0.7)]">
                <span aria-live="polite">
                  {currentImageIndex + 1} {translations.animal.photoOf}{" "}
                  {images.length}
                </span>
                <div
                  role="group"
                  aria-label={translations.animal.photoNavigation}
                  className="flex items-center gap-2"
                >
                  {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`h-2 w-2 rounded-full border border-white p-0 ${index === currentImageIndex ? "bg-white" : "bg-transparent"}`}
                      aria-label={`${translations.animal.photo} ${index + 1}`}
                      aria-pressed={index === currentImageIndex}
                      onClick={() => setActiveImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div>
          <Eyebrow tone="dark">{translations.animal.collectionSpecimen}</Eyebrow>
          <h1 className="mt-5 mb-3 text-[clamp(56px,7vw,120px)] leading-[0.84] tracking-[-0.06em] max-[800px]:text-[clamp(54px,18vw,90px)]">{animalName}</h1>
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] opacity-70">
            {animal.latinName || animal.speciesLatinName || animal.species}
          </p>
          <p className="my-[30px] max-w-[500px] text-[18px] leading-[1.6]">
            {text(
              animal.description,
              locale,
              translations.animal.detailFallback,
            )}
          </p>
          <div className="my-8 grid grid-cols-2 border-t border-ink/20">
            <div className="border-b border-ink/20 py-[18px] pr-3">
              <small className="mb-[9px] block font-mono text-[10px] leading-none tracking-[0.14em] opacity-60">{translations.animal.morph}</small>
              <strong className="text-[16px] font-medium">{text(animal.morph, locale, "—")}</strong>
            </div>
            <div className="border-b border-ink/20 py-[18px] pr-3">
              <small className="mb-[9px] block font-mono text-[10px] leading-none tracking-[0.14em] opacity-60">{translations.animal.sex}</small>
              <strong className="text-[16px] font-medium">{text(animal.sex, locale, "—")}</strong>
            </div>
            <div className="border-b border-ink/20 py-[18px] pr-3">
              <small className="mb-[9px] block font-mono text-[10px] leading-none tracking-[0.14em] opacity-60">{translations.animal.weight}</small>
              <strong className="text-[16px] font-medium">{animal.weight || "—"}</strong>
            </div>
            <div className="border-b border-ink/20 py-[18px] pr-3">
              <small className="mb-[9px] block font-mono text-[10px] leading-none tracking-[0.14em] opacity-60">{translations.animal.status}</small>
              <strong className="text-[16px] font-medium">{translations.animal[status]}</strong>
            </div>
            {animal.price && (
              <div className="col-span-2 border-b border-ink/20 py-[18px] pr-3">
                <small className="mb-[9px] block font-mono text-[10px] leading-none tracking-[0.14em] opacity-60">{translations.animal.price}</small>
                <strong className="text-[16px] font-medium">{animal.price}</strong>
              </div>
            )}
          </div>
          <button
            type="button"
            className={outlineButtonClassName}
            onClick={() => setContactOpen(true)}
          >
            {translations.animal.askAboutAnimal} <ArrowUpRight size={16} />
          </button>
        </div>
      </section>
      {zoomOpen && currentImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={animalName}
          className="fixed inset-0 z-50 grid touch-pan-y place-items-center bg-[rgba(8,14,11,0.94)] p-4 max-[800px]:p-0"
          onClick={() => {
            if (!zoomSwipe.didMove()) setZoomOpen(false);
          }}
          {...zoomSwipe.handlers}
        >
          <img
            src={zoomImageUrl(currentImage)}
            alt={`${animalName} (${currentImageIndex + 1} ${translations.animal.photoOf} ${images.length})`}
            className="max-h-full max-w-full object-contain"
            draggable={false}
            onClick={(event) => event.stopPropagation()}
          />
          <button
            ref={closeZoomRef}
            type="button"
            className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full border border-[rgba(255,255,255,0.6)] bg-[rgba(15,31,22,0.7)] text-white hover:bg-[rgba(15,31,22,0.95)]"
            aria-label={translations.animal.closePhoto}
            onClick={(event) => {
              event.stopPropagation();
              setZoomOpen(false);
            }}
          >
            <X size={22} />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="absolute top-1/2 left-4 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[rgba(255,255,255,0.6)] bg-[rgba(15,31,22,0.7)] text-white hover:bg-[rgba(15,31,22,0.95)]"
                aria-label={translations.animal.previousPhoto}
                onClick={(event) => {
                  event.stopPropagation();
                  showImage(-1);
                }}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className="absolute top-1/2 right-4 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[rgba(255,255,255,0.6)] bg-[rgba(15,31,22,0.7)] text-white hover:bg-[rgba(15,31,22,0.95)]"
                aria-label={translations.animal.nextPhoto}
                onClick={(event) => {
                  event.stopPropagation();
                  showImage(1);
                }}
              >
                <ChevronRight size={22} />
              </button>
              <span
                aria-live="polite"
                className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[11px] text-white [text-shadow:0_1px_5px_rgba(0,0,0,0.7)]"
              >
                {currentImageIndex + 1} {translations.animal.photoOf}{" "}
                {images.length}
              </span>
            </>
          )}
        </div>
      )}
      <ContactFormModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        animal={animal}
      />
    </main>
  );
}
