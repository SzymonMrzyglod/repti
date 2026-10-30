import { useEffect, useState, type ComponentProps } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import AnimalDetail from "@/components/animals/animal-detail";
import {
  GuideDetailPage,
  GuidesPage,
  type Guide,
} from "@/components/guides/guide-pages";
import HomePage from "@/components/home/home-page";
import { useLocale } from "@/lib/locale-context";
import {
  guideByIdQuery,
  guidesQuery,
  reptileByIdQuery,
  reptilesQuery,
  sanityClient,
  siteSettingsQuery,
} from "@/lib/sanity";
import { getTranslations } from "@/lib/translations";

type Localized = { pl?: string; en?: string };
type SanityReptile = {
  _id: string;
  name?: Localized;
  species?: string;
  speciesName?: Localized;
  speciesLatinName?: string;
  latinName?: string;
  morph?: Localized;
  sex?: Localized;
  weight?: string;
  status?: string;
  description?: Localized;
  imageUrl?: string;
};
type HomePageProps = ComponentProps<typeof HomePage>;
type HomeSettings = HomePageProps["settings"];
type HomeAnimal = HomePageProps["animals"][number];
type HomeData = { reptiles: SanityReptile[]; settings: HomeSettings };

function localizedText(value: Localized | undefined, locale: "pl" | "en") {
  return value?.[locale] || (locale === "pl" ? value?.en : "") || "";
}

function mapAnimalStatus(status?: string): HomeAnimal["status"] {
  if (status === "reserved") return "reserved";
  if (status === "adopted") return "adopted";
  return "available";
}

function mapHomeData(
  reptiles: SanityReptile[],
  settings: HomeSettings,
  locale: "pl" | "en",
): HomePageProps {
  return {
    settings,
    animals: reptiles.map((reptile) => ({
      id: reptile._id,
      name: localizedText(reptile.name, locale),
      species:
        localizedText(reptile.speciesName, locale) || reptile.species || "",
      latin: reptile.latinName || reptile.speciesLatinName || "",
      morph: localizedText(reptile.morph, locale),
      sex: localizedText(reptile.sex, locale),
      weight: reptile.weight || "",
      status: mapAnimalStatus(reptile.status),
      image: reptile.imageUrl || "",
    })),
  };
}

function HomeRoute() {
  const { locale } = useLocale();
  const translations = getTranslations(locale);
  const [data, setData] = useState<HomeData | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true;

    Promise.all([
      sanityClient.fetch<SanityReptile[]>(reptilesQuery),
      sanityClient.fetch<HomeSettings | null>(siteSettingsQuery),
    ])
      .then(([reptiles, settings]) => {
        if (isActive) {
          setData({ reptiles, settings: settings || {} });
        }
      })
      .catch(() => {
        if (isActive) setHasError(true);
      });

    return () => {
      isActive = false;
    };
  }, []);

  if (hasError) {
    return <main className="guides-empty">{translations.home.loadError}</main>;
  }

  if (!data) {
    return <main className="guides-empty">{translations.home.loading}</main>;
  }

  return <HomePage {...mapHomeData(data.reptiles, data.settings, locale)} />;
}

function GuidesRoute() {
  const [guides, setGuides] = useState<Guide[]>([]);

  useEffect(() => {
    let isActive = true;

    sanityClient.fetch<Guide[]>(guidesQuery).then((result) => {
      if (isActive) setGuides(result);
    });

    return () => {
      isActive = false;
    };
  }, []);

  return <GuidesPage guides={guides} />;
}

function AnimalRoute() {
  const { locale } = useLocale();
  const translations = getTranslations(locale);
  const { name } = useParams();
  const [animal, setAnimal] = useState<SanityReptile | null>(null);

  useEffect(() => {
    if (!name) return;

    let isActive = true;

    sanityClient
      .fetch<SanityReptile | null>(reptileByIdQuery, { id: name })
      .then((result) => {
        if (isActive) setAnimal(result);
      });

    return () => {
      isActive = false;
    };
  }, [name]);

  if (!animal) {
    return <main className="guides-empty">{translations.home.loading}</main>;
  }
  return <AnimalDetail animal={animal} />;
}

function GuideRoute() {
  const { locale } = useLocale();
  const translations = getTranslations(locale);
  const { id } = useParams();
  const [guide, setGuide] = useState<Guide | null>(null);

  useEffect(() => {
    if (!id) return;

    let isActive = true;

    sanityClient.fetch<Guide | null>(guideByIdQuery, { id }).then((result) => {
      if (isActive) setGuide(result);
    });

    return () => {
      isActive = false;
    };
  }, [id]);

  if (!guide) {
    return <main className="guides-empty">{translations.home.loading}</main>;
  }

  return <GuideDetailPage guide={guide} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/guides" element={<GuidesRoute />} />
      <Route path="/guides/:id" element={<GuideRoute />} />
      <Route path="/animal/:name" element={<AnimalRoute />} />
      <Route path="*" element={<HomeRoute />} />
    </Routes>
  );
}
