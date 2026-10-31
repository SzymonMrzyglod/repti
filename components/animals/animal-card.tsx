import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { getTranslations } from "@/lib/translations";

type Animal = {
  id: string;
  name: string;
  latin: string;
  morph: string;
  sex: string;
  weight: string;
  price?: string;
  featured?: boolean;
  status: "available" | "reserved" | "adopted";
  image: string;
};

export default function AnimalCard({ animal }: { animal: Animal }) {
  const { locale } = useLocale();
  const translations = getTranslations(locale);

  return (
    <Link
      to={`/animal/${encodeURIComponent(animal.id)}`}
      className="group"
    >
      <div className="relative h-[440px] overflow-hidden bg-[#293a2e] max-[700px]:h-[420px]">
        {animal.featured && (
          <span className="pointer-events-none absolute inset-0 z-10 border-2 border-gold" aria-hidden="true" />
        )}        {animal.featured && (
          <span className="absolute top-[15px] right-[15px] z-10 bg-gold px-[10px] py-[7px] text-[8px] font-medium uppercase tracking-[0.15em] text-[#1d2a20]">
            {translations.animal.featured}
          </span>
        )}        {animal.image ? (
          <img
            src={animal.image}
            alt={`${animal.name}, ${animal.morph}`}
            className="h-full w-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="h-full w-full object-cover" aria-hidden="true" />
        )}
        <span
          className={`absolute top-[15px] left-[15px] px-[10px] py-[7px] text-[8px] uppercase tracking-[0.15em] ${animal.status === "available" ? "bg-[#e4d8b8] text-[#43513d]" : "bg-[#30483b] text-[#d9dbc9]"}`}
        >
          {translations.animal[animal.status]}
        </span>
        <span className="absolute right-[15px] bottom-[15px] grid h-[37px] w-[37px] place-items-center rounded-full border border-[rgba(255,255,255,0.6)] bg-[rgba(15,31,22,0.3)] text-white" aria-hidden="true">
          <ArrowUpRight size={17} />
        </span>
      </div>
      <div className="pt-[17px] px-[2px]">
        <div className="flex items-baseline justify-between">
          <h3 className="m-0 font-display text-[25px] font-normal">{animal.name}</h3>
          <span className="text-[10px] uppercase tracking-[0.1em] text-sage">{animal.sex}</span>
        </div>
        <p className="mt-[5px] text-[10px] italic tracking-[0.04em] text-sage">{animal.latin}</p>
        <div className="mt-[17px] flex gap-[30px] border-t border-forest-border pt-3 text-[11px] text-[#d7d9cc]">
          <span className="flex flex-col gap-[5px]">
            <small className="text-[8px] tracking-[0.16em] text-sage-muted">{translations.animal.morph}</small>
            {animal.morph}
          </span>
          <span className="flex flex-col gap-[5px]">
            <small className="text-[8px] tracking-[0.16em] text-sage-muted">{translations.animal.weight}</small>
            {animal.weight}
          </span>
          {animal.price && (
            <span className="ml-auto flex flex-col gap-[5px] text-right">
              <small className="text-[8px] tracking-[0.16em] text-sage-muted">{translations.animal.price}</small>
              <strong className="font-medium text-gold">{animal.price}</strong>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
