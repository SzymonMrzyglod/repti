import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { getTranslations } from "@/lib/translations";
import type { MouseEvent } from "react";
import { saveCollectionReturnState } from "@/lib/collection-navigation";

type Animal = {
  id: string;
  name: string;
  latin: string;
  morph: string;
  sex: string;
  weight: string;
  status: "available" | "reserved" | "adopted";
  image: string;
};

export default function AnimalCard({
  animal,
  collectionShowAll,
}: {
  animal: Animal;
  collectionShowAll: boolean;
}) {
  const { locale } = useLocale();
  const translations = getTranslations(locale);
  const navigate = useNavigate();
  const location = useLocation();
  const animalPath = `/animal/${encodeURIComponent(animal.id)}`;

  return (
    <Link
      to={animalPath}
      className="animal-card"
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        event.preventDefault();
        const collectionReturnState = {
          collectionScrollY: window.scrollY,
          collectionShowAll,
        };
        saveCollectionReturnState(collectionReturnState, location.key);
        navigate(animalPath, {
          state: collectionReturnState,
        });
      }}
    >
      <div className="card-image-wrap">
        {animal.image ? (
          <img
            src={animal.image}
            alt={`${animal.name}, ${animal.morph}`}
            className="card-image"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="card-image card-image-empty" aria-hidden="true" />
        )}
        <span
          className={`status-pill ${animal.status === "available" ? "available" : "reserved"}`}
        >
          {translations.animal[animal.status]}
        </span>
        <span className="card-arrow" aria-hidden="true">
          <ArrowUpRight size={17} />
        </span>
      </div>
      <div className="card-copy">
        <div className="card-title-row">
          <h3>{animal.name}</h3>
          <span className="sex">{animal.sex}</span>
        </div>
        <p className="latin">{animal.latin}</p>
        <div className="animal-meta">
          <span>
            <small>{translations.animal.morph}</small>
            {animal.morph}
          </span>
          <span>
            <small>{translations.animal.weight}</small>
            {animal.weight}
          </span>
        </div>
      </div>
    </Link>
  );
}
