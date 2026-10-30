import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LocaleSwitcher from "@/components/layout/locale-switcher";
import { ContactFormModal } from "@/components/contact-form";
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
  const location = useLocation();
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
  const collectionScrollY =
    location.state &&
    typeof location.state.collectionScrollY === "number" &&
    Number.isFinite(location.state.collectionScrollY)
      ? location.state.collectionScrollY
      : undefined;
  const collectionShowAll =
    location.state &&
    typeof location.state.collectionShowAll === "boolean"
      ? location.state.collectionShowAll
      : undefined;
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
    <main className="detail-page">
      <header className="detail-header">
        <Link
          to="/#animals"
          state={{ collectionScrollY, collectionShowAll }}
          className="text-link"
        >
          <ArrowLeft size={15} /> {translations.animal.backToCollection}
        </Link>
        <LocaleSwitcher />
      </header>
      <section className="detail-grid">
        <div className="detail-image-wrap">
          {currentImage ? (
            <img
              src={currentImage}
              alt={`${text(animal.name, locale, translations.animal.unnamed)} (${currentImageIndex + 1} ${translations.animal.photoOf} ${images.length})`}
              className="detail-image"
              fetchPriority="high"
              decoding="async"
            />
          ) : (
            <div className="detail-image detail-image-empty" />
          )}
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="gallery-control gallery-control-previous"
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
                className="gallery-control gallery-control-next"
                aria-label={translations.animal.nextPhoto}
                onClick={() =>
                  setActiveImageIndex((currentImageIndex + 1) % images.length)
                }
              >
                <ChevronRight size={20} />
              </button>
              <div className="gallery-indicators">
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
                      className={index === currentImageIndex ? "active" : ""}
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
        <div className="detail-copy">
          <p className="eyebrow dark">
            <span /> {translations.animal.collectionSpecimen}
          </p>
          <h1>{animalName}</h1>
          <p className="detail-species">
            {animal.latinName || animal.speciesLatinName || animal.species}
          </p>
          <p className="detail-description">
            {text(
              animal.description,
              locale,
              translations.animal.detailFallback,
            )}
          </p>
          <div className="detail-facts">
            <div>
              <small>{translations.animal.morph}</small>
              <strong>{text(animal.morph, locale, "—")}</strong>
            </div>
            <div>
              <small>{translations.animal.sex}</small>
              <strong>{text(animal.sex, locale, "—")}</strong>
            </div>
            <div>
              <small>{translations.animal.weight}</small>
              <strong>{animal.weight || "—"}</strong>
            </div>
            <div>
              <small>{translations.animal.status}</small>
              <strong>{translations.animal[status]}</strong>
            </div>
          </div>
          <button
            type="button"
            className="outline-button"
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
