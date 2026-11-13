import type { ComponentProps } from "react";
import type HomePage from "@/components/home/home-page";
import { localizedText, type Localized } from "@/lib/localized";

export type SanityReptile = {
  _id: string;
  name?: Localized;
  speciesId?: string;
  species?: string;
  speciesName?: Localized;
  speciesLatinName?: string;
  latinName?: string;
  morph?: Localized;
  sex?: Localized;
  weight?: string;
  price?: string;
  featured?: boolean;
  status?: string;
  description?: Localized;
  imageUrl?: string;
};

type HomePageProps = ComponentProps<typeof HomePage>;
export type HomeSettings = HomePageProps["settings"];
export type HomeData = { reptiles: SanityReptile[]; settings: HomeSettings };
type HomeAnimal = HomePageProps["animals"][number];

function mapAnimalStatus(status?: string): HomeAnimal["status"] {
  if (status === "reserved") return "reserved";
  if (status === "adopted") return "adopted";
  return "available";
}

export function mapHomeData(
  reptiles: SanityReptile[],
  settings: HomeSettings,
  locale: "pl" | "en",
): HomePageProps {
  return {
    settings,
    animals: reptiles.map((reptile) => ({
      id: reptile._id,
      name: localizedText(reptile.name, locale),
      speciesId: reptile.speciesId,
      species: localizedText(reptile.speciesName, locale) || reptile.species || "",
      latin: reptile.latinName || reptile.speciesLatinName || "",
      morph: localizedText(reptile.morph, locale),
      sex: localizedText(reptile.sex, locale),
      weight: reptile.weight || "",
      price: reptile.price || "",
      featured: Boolean(reptile.featured),
      status: mapAnimalStatus(reptile.status),
      image: reptile.imageUrl || "",
    })),
  };
}
