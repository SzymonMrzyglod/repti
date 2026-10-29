import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Animal = {
  id: string;
  name: string;
  latin: string;
  morph: string;
  sex: string;
  weight: string;
  status: "Dostępny" | "Rezerwacja" | "Adoptowany";
  image: string;
};

export default function AnimalCard({ animal }: { animal: Animal }) {
  return (
    <Link
      href={`/animal/${encodeURIComponent(animal.id)}`}
      className="animal-card"
    >
      <div className="card-image-wrap">
        {animal.image ? (
          <img
            src={animal.image}
            alt={`${animal.name}, ${animal.morph}`}
            className="card-image"
          />
        ) : (
          <div className="card-image card-image-empty" aria-hidden="true" />
        )}
        <span
          className={`status-pill ${animal.status === "Dostępny" ? "available" : "reserved"}`}
        >
          {animal.status}
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
            <small>ODMIANA</small>
            {animal.morph}
          </span>
          <span>
            <small>WAGA</small>
            {animal.weight}
          </span>
        </div>
      </div>
    </Link>
  );
}
