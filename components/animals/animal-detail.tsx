import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
} from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import { ContactFormModal } from "@/components/contact/contact-form";
import Eyebrow from "@/components/ui/eyebrow";
import {
  textLinkClassName,
  pageShellClassName,
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
const zoomImageUrl = (url: string) =>
  url
    .replace(/([?&]w=)\d+/, (_, prefix) => `${prefix}2200`)
    .replace(/([?&]q=)\d+/, (_, prefix) => `${prefix}78`);

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

const MAX_ZOOM = 4;
const DOUBLE_TAP_ZOOM = 2.5;

// Touch gestures for the lightbox: pinch to zoom, drag to pan while zoomed,
// double-tap to toggle zoom and horizontal swipe to change photo at 1x.
function useZoomGestures(onSwipe: (direction: 1 | -1) => void) {
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const viewRef = useRef(view);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({
    pinched: false,
    moved: false,
    startDistance: 0,
    startView: { scale: 1, x: 0, y: 0 },
    startMid: { x: 0, y: 0 },
    panOrigin: { x: 0, y: 0 },
    swipeOrigin: { x: 0, y: 0 },
    lastTap: 0,
  });

  const apply = (next: { scale: number; x: number; y: number }) => {
    const scale = Math.min(Math.max(next.scale, 1), MAX_ZOOM);
    if (scale === 1) {
      viewRef.current = { scale: 1, x: 0, y: 0 };
    } else {
      const maxX = ((scale - 1) * window.innerWidth) / 2;
      const maxY = ((scale - 1) * window.innerHeight) / 2;
      viewRef.current = {
        scale,
        x: Math.min(Math.max(next.x, -maxX), maxX),
        y: Math.min(Math.max(next.y, -maxY), maxY),
      };
    }
    setView(viewRef.current);
  };

  const beginPinch = () => {
    const [a, b] = Array.from(pointers.current.values());
    const g = gesture.current;
    g.pinched = true;
    g.startDistance = Math.hypot(a.x - b.x, a.y - b.y) || 1;
    g.startView = viewRef.current;
    g.startMid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  };

  const beginPan = (point: { x: number; y: number }) => {
    const g = gesture.current;
    g.panOrigin = { x: point.x - viewRef.current.x, y: point.y - viewRef.current.y };
    g.swipeOrigin = point;
  };

  return {
    view,
    didMove: () => gesture.current.moved,
    reset: () => {
      pointers.current.clear();
      apply({ scale: 1, x: 0, y: 0 });
    },
    handlers: {
      onPointerDown: (event: React.PointerEvent) => {
        if (event.pointerType === "mouse") return;
        const g = gesture.current;
        if (pointers.current.size === 0) {
          g.moved = false;
          g.pinched = false;
        }
        const point = { x: event.clientX, y: event.clientY };
        pointers.current.set(event.pointerId, point);
        if (pointers.current.size === 2) beginPinch();
        else if (pointers.current.size === 1) beginPan(point);
      },
      onPointerMove: (event: React.PointerEvent) => {
        if (!pointers.current.has(event.pointerId)) return;
        const point = { x: event.clientX, y: event.clientY };
        pointers.current.set(event.pointerId, point);
        const g = gesture.current;

        if (pointers.current.size >= 2) {
          const [a, b] = Array.from(pointers.current.values());
          const scale = Math.min(
            Math.max((g.startView.scale * Math.hypot(a.x - b.x, a.y - b.y)) / g.startDistance, 1),
            MAX_ZOOM,
          );
          const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
          const cx = window.innerWidth / 2;
          const cy = window.innerHeight / 2;
          // Keep the content point under the initial midpoint under the fingers.
          const qx = (g.startMid.x - cx - g.startView.x) / g.startView.scale;
          const qy = (g.startMid.y - cy - g.startView.y) / g.startView.scale;
          g.moved = true;
          apply({ scale, x: mid.x - cx - scale * qx, y: mid.y - cy - scale * qy });
        } else if (viewRef.current.scale > 1) {
          if (Math.hypot(point.x - g.swipeOrigin.x, point.y - g.swipeOrigin.y) > 10) {
            g.moved = true;
          }
          apply({
            scale: viewRef.current.scale,
            x: point.x - g.panOrigin.x,
            y: point.y - g.panOrigin.y,
          });
        } else if (Math.hypot(point.x - g.swipeOrigin.x, point.y - g.swipeOrigin.y) > 10) {
          g.moved = true;
        }
      },
      onPointerUp: (event: React.PointerEvent) => {
        if (!pointers.current.has(event.pointerId)) return;
        const g = gesture.current;
        pointers.current.delete(event.pointerId);

        if (pointers.current.size === 1) {
          const [remaining] = Array.from(pointers.current.values());
          beginPan(remaining);
          return;
        }
        if (pointers.current.size > 0 || g.pinched) return;

        const deltaX = event.clientX - g.swipeOrigin.x;
        const deltaY = event.clientY - g.swipeOrigin.y;

        if (!g.moved) {
          const now = Date.now();
          if (now - g.lastTap < 300) {
            g.lastTap = 0;
            g.moved = true;
            apply(
              viewRef.current.scale > 1
                ? { scale: 1, x: 0, y: 0 }
                : {
                    scale: DOUBLE_TAP_ZOOM,
                    x: -(event.clientX - window.innerWidth / 2) * (DOUBLE_TAP_ZOOM - 1),
                    y: -(event.clientY - window.innerHeight / 2) * (DOUBLE_TAP_ZOOM - 1),
                  },
            );
          } else {
            g.lastTap = now;
          }
          return;
        }

        if (
          viewRef.current.scale === 1 &&
          Math.abs(deltaX) >= 40 &&
          Math.abs(deltaX) > Math.abs(deltaY)
        ) {
          onSwipe(deltaX < 0 ? 1 : -1);
        }
      },
      onPointerCancel: (event: React.PointerEvent) => {
        pointers.current.delete(event.pointerId);
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
  const [loadedZoomUrl, setLoadedZoomUrl] = useState("");
  const closeZoomRef = useRef<HTMLButtonElement>(null);
  const images = Array.from(
    new Set([animal.imageUrl, ...(animal.galleryUrls || [])].filter(Boolean)),
  ) as string[];
  const currentImageIndex = Math.min(
    activeImageIndex,
    Math.max(images.length - 1, 0),
  );
  const currentImage = images[currentImageIndex];
  const zoomUrl = currentImage ? zoomImageUrl(currentImage) : "";
  const showImage = (direction: 1 | -1) =>
    setActiveImageIndex(
      (currentImageIndex + direction + images.length) % images.length,
    );
  const handleSwipe = (direction: 1 | -1) => {
    if (images.length > 1) showImage(direction);
  };
  const gallerySwipe = useSwipe(handleSwipe);
  const zoomSwipe = useZoomGestures(handleSwipe);
  const { reset: resetZoomGestures } = zoomSwipe;
  const [pinchHintVisible, setPinchHintVisible] = useState(false);
  const isZoomedIn = zoomSwipe.view.scale > 1;
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
    resetZoomGestures();
  }, [zoomUrl, zoomOpen]);

  useEffect(() => {
    if (!zoomOpen || !window.matchMedia("(pointer: coarse)").matches) {
      setPinchHintVisible(false);
      return;
    }

    setPinchHintVisible(true);
    const timeout = window.setTimeout(() => setPinchHintVisible(false), 4500);
    return () => window.clearTimeout(timeout);
  }, [zoomOpen]);

  useEffect(() => {
    if (isZoomedIn) setPinchHintVisible(false);
  }, [isZoomedIn]);

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
      <PageHeader
        backTo="/#animals"
        backLabel={translations.animal.backToCollection}
        className="mb-16 max-[800px]:mb-9"
      />
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
              <span className="pointer-events-none absolute top-3 right-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-forest/45 px-4 py-[9px] text-[12px] font-medium uppercase tracking-[0.18em] text-ivory backdrop-blur-sm transition-[color,background-color,border-color] duration-300 group-hover:border-gold/70 group-hover:bg-forest/70 group-hover:text-gold motion-reduce:transition-none">
                <ZoomIn size={14} aria-hidden="true" />
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
                className="absolute top-1/2                 left-3 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-[rgba(255,255,255,0.6)] bg-[rgba(15,31,22,0.55)] text-white hover:bg-[rgba(15,31,22,0.85)]"
                aria-label={translations.animal.previousPhoto}
                onClick={() => showImage(-1)}
              >
                                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="absolute top-1/2                 right-3 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-[rgba(255,255,255,0.6)] bg-[rgba(15,31,22,0.55)] text-white hover:bg-[rgba(15,31,22,0.85)]"
                aria-label={translations.animal.nextPhoto}
                onClick={() => showImage(1)}
              >
                                <ChevronRight size={16} />
              </button>
              <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between font-mono text-[12px] text-white [text-shadow:0_1px_5px_rgba(0,0,0,0.7)]">
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
          <p className="font-sans text-[14px] min-[701px]:text-[16px] uppercase tracking-[0.12em] opacity-70">
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
              <small className="mb-[9px] block font-mono text-[12px] leading-none tracking-[0.14em] opacity-60">{translations.animal.morph}</small>
              <strong className="text-[16px] font-medium">{text(animal.morph, locale, "—")}</strong>
            </div>
            <div className="border-b border-ink/20 py-[18px] pr-3">
              <small className="mb-[9px] block font-mono text-[12px] leading-none tracking-[0.14em] opacity-60">{translations.animal.sex}</small>
              <strong className="text-[16px] font-medium">{text(animal.sex, locale, "—")}</strong>
            </div>
            <div className="border-b border-ink/20 py-[18px] pr-3">
              <small className="mb-[9px] block font-mono text-[12px] leading-none tracking-[0.14em] opacity-60">{translations.animal.weight}</small>
              <strong className="text-[16px] font-medium">{animal.weight || "—"}</strong>
            </div>
            <div className="border-b border-ink/20 py-[18px] pr-3">
              <small className="mb-[9px] block font-mono text-[12px] leading-none tracking-[0.14em] opacity-60">{translations.animal.status}</small>
              <strong className="text-[16px] font-medium">{translations.animal[status]}</strong>
            </div>
            {animal.price && (
              <div className="col-span-2 border-b border-ink/20 py-[18px] pr-3">
                <small className="mb-[9px] block font-mono text-[12px] leading-none tracking-[0.14em] opacity-60">{translations.animal.price}</small>
                <strong className="text-[16px] font-medium">{animal.price}</strong>
              </div>
            )}
          </div>
          <button
            type="button"
            className={`${textLinkClassName} w-fit cursor-pointer border-x-0 border-t-0 bg-transparent text-forest`}
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
          className="fixed inset-0 z-50 grid touch-none place-items-center overflow-hidden bg-[rgba(8,14,11,0.94)] p-4 max-[800px]:p-0"
          onClick={() => {
            if (!zoomSwipe.didMove() && !isZoomedIn) setZoomOpen(false);
          }}
          {...zoomSwipe.handlers}
        >
          {loadedZoomUrl !== zoomUrl && (
            <span
              role="status"
              aria-label={translations.animal.loadingPhoto}
              className="pointer-events-none absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-[rgba(255,255,255,0.25)] border-t-white motion-reduce:animate-none"
            />
          )}
          <img
            key={zoomUrl}
            src={zoomUrl}
            alt={`${animalName} (${currentImageIndex + 1} ${translations.animal.photoOf} ${images.length})`}
            className={`max-h-[90vh] max-w-[90vw] object-contain transition-opacity duration-200 motion-reduce:transition-none ${loadedZoomUrl === zoomUrl ? "opacity-100" : "opacity-0"}`}
            draggable={false}
            style={{
              transform: `translate(${zoomSwipe.view.x}px, ${zoomSwipe.view.y}px) scale(${zoomSwipe.view.scale})`,
            }}
            onLoad={() => setLoadedZoomUrl(zoomUrl)}
            onError={() => setLoadedZoomUrl(zoomUrl)}
            onClick={(event) => event.stopPropagation()}
          />
          {pinchHintVisible && (
            <span
              role="status"
              className="pointer-events-none absolute top-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-[rgba(255,255,255,0.5)] bg-[rgba(15,31,22,0.8)]               px-3 py-1.5 text-[12px] whitespace-nowrap text-white"
            >
                            <ZoomIn size={14} aria-hidden="true" />
              {translations.animal.pinchHint}
            </span>
          )}
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
                className="absolute top-1/2 left-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-[rgba(255,255,255,0.6)] bg-[rgba(15,31,22,0.7)] text-white hover:bg-[rgba(15,31,22,0.95)]"
                aria-label={translations.animal.previousPhoto}
                onClick={(event) => {
                  event.stopPropagation();
                  showImage(-1);
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="absolute top-1/2 right-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-[rgba(255,255,255,0.6)] bg-[rgba(15,31,22,0.7)] text-white hover:bg-[rgba(15,31,22,0.95)]"
                aria-label={translations.animal.nextPhoto}
                onClick={(event) => {
                  event.stopPropagation();
                  showImage(1);
                }}
              >
                <ChevronRight size={18} />
              </button>
              <span
                aria-live="polite"
                className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[12px] text-white [text-shadow:0_1px_5px_rgba(0,0,0,0.7)]"
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
