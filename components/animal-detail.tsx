import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

type Localized = { pl?: string; en?: string };
type AnimalDetailProps = {
  animal: {
    name?: Localized;
    species?: string;
    latinName?: string;
    morph?: Localized;
    sex?: Localized;
    weight?: string;
    status?: string;
    description?: Localized;
    price?: string;
    imageUrl?: string;
  };
};
const text = (
  value: Localized | undefined,
  locale: "pl" | "en",
  fallback: string,
) => value?.[locale] || value?.pl || value?.en || fallback;

export default function AnimalDetail({ animal }: AnimalDetailProps) {
  const [locale, setLocale] = useState<"pl" | "en">("pl");
  const isReserved = animal.status === "reserved";
  return (
    <main className="detail-page">
      <header className="detail-header">
        <Link href="/#zwierzeta" className="text-link">
          <ArrowLeft size={15} />{" "}
          {locale === "en" ? "Back to collection" : "Wróć do kolekcji"}
        </Link>
        <div className="language-switcher">
          <button
            className={locale === "pl" ? "active" : ""}
            onClick={() => setLocale("pl")}
          >
            PL
          </button>
          <button
            className={locale === "en" ? "active" : ""}
            onClick={() => setLocale("en")}
          >
            EN
          </button>
        </div>
      </header>
      <section className="detail-grid">
        <div className="detail-image-wrap">
          {animal.imageUrl ? (
            <img
              src={animal.imageUrl}
              alt={text(animal.name, locale, "Reptile")}
              className="detail-image"
            />
          ) : (
            <div className="detail-image detail-image-empty" />
          )}
        </div>
        <div className="detail-copy">
          <p className="eyebrow dark">
            <span />{" "}
            {locale === "en" ? "COLLECTION SPECIMEN" : "PODOPIECZNY Z KOLEKCJI"}
          </p>
          <h1>{text(animal.name, locale, "Podopieczny")}</h1>
          <p className="detail-species">{animal.latinName || animal.species}</p>
          <p className="detail-description">
            {text(
              animal.description,
              locale,
              locale === "en"
                ? "Details coming soon."
                : "Opis pojawi się wkrótce.",
            )}
          </p>
          <div className="detail-facts">
            <div>
              <small>{locale === "en" ? "MORPH" : "ODMIANA"}</small>
              <strong>{text(animal.morph, locale, "—")}</strong>
            </div>
            <div>
              <small>{locale === "en" ? "SEX" : "PŁEĆ"}</small>
              <strong>{text(animal.sex, locale, "—")}</strong>
            </div>
            <div>
              <small>{locale === "en" ? "WEIGHT" : "WAGA"}</small>
              <strong>{animal.weight || "—"}</strong>
            </div>
            <div>
              <small>{locale === "en" ? "STATUS" : "STATUS"}</small>
              <strong>
                {isReserved
                  ? locale === "en"
                    ? "Reserved"
                    : "Rezerwacja"
                  : locale === "en"
                    ? "Available"
                    : "Dostępny"}
              </strong>
            </div>
          </div>
          <a href="/#kontakt" className="outline-button">
            {locale === "en"
              ? "Ask about this animal"
              : "Zapytaj o tego podopiecznego"}{" "}
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
    </main>
  );
}
