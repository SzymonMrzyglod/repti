import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
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
import { getTranslations } from "@/lib/translations";

type Localized = { pl?: string; en?: string };
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
const text = (
  value: Localized | undefined,
  locale: "pl" | "en",
  fallback: string,
) => value?.[locale] || (locale === "pl" ? value?.en : undefined) || fallback;

export default function AnimalDetail({ animal }: AnimalDetailProps) {
  const { locale } = useLocale();
  const translations = getTranslations(locale);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const images = Array.from(
    new Set([animal.imageUrl, ...(animal.galleryUrls || [])].filter(Boolean)),
  ) as string[];
  const currentImageIndex = Math.min(
    activeImageIndex,
    Math.max(images.length - 1, 0),
  );
  const currentImage = images[currentImageIndex];
  const animalName = text(animal.name, locale, translations.animal.unnamed);
  const status =
    animal.status === "reserved"
      ? "reserved"
      : animal.status === "adopted"
        ? "adopted"
        : "available";

  useEffect(() => {
    setActiveImageIndex(0);
  }, [animal._id]);

  return (
    <main className={`${pageShellClassName} pb-20 max-[800px]:pt-[18px] max-[800px]:pb-12`}>
      <header className="mx-auto mb-16 flex max-w-[1240px] items-center justify-between max-[800px]:mb-9">
        <Link to="/#animals" className={`${spacedTextLinkClassName} text-forest`}>
          <ArrowLeft size={15} /> {translations.animal.backToCollection}
        </Link>
        <LocaleSwitcher />
      </header>
      <section className="mx-auto grid max-w-[1240px] grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] items-center gap-[clamp(40px,7vw,120px)] max-[800px]:grid-cols-1 max-[800px]:gap-[34px]">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#26352a]">
          {currentImage ? (
            <img
              src={currentImage}
              alt={`${text(animal.name, locale, translations.animal.unnamed)} (${currentImageIndex + 1} ${translations.animal.photoOf} ${images.length})`}
              className="block h-full w-full object-cover"
              fetchPriority="high"
              decoding="async"
            />
          ) : (
            <div className="h-full w-full bg-[linear-gradient(145deg,#253a2a,#8d9a75)]" />
          )}
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="absolute top-1/2 left-4 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[rgba(255,255,255,0.6)] bg-[rgba(15,31,22,0.55)] text-white hover:bg-[rgba(15,31,22,0.85)]"
                aria-label={translations.animal.previousPhoto}
                onClick={() =>
                  setActiveImageIndex(
                    (currentImageIndex - 1 + images.length) % images.length,
                  )
                }
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="absolute top-1/2 right-4 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[rgba(255,255,255,0.6)] bg-[rgba(15,31,22,0.55)] text-white hover:bg-[rgba(15,31,22,0.85)]"
                aria-label={translations.animal.nextPhoto}
                onClick={() =>
                  setActiveImageIndex((currentImageIndex + 1) % images.length)
                }
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
      <ContactFormModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        animal={animal}
      />
    </main>
  );
}
