import { useLayoutEffect, useState, useEffect, type ComponentProps } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import AnimalDetail from "@/components/animals/animal-detail";
import ContactForm from "@/components/contact/contact-form";
import LoadingState from "@/components/layout/loading-state";
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
import { getHomeViewState } from "@/lib/home-view-state";

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
  const location = useLocation();
  const translations = getTranslations(locale);
  const [savedView] = useState(getHomeViewState);
  const [data, setData] = useState<HomeData | null>(null);
  const [hasError, setHasError] = useState(false);

  useLayoutEffect(() => {
    if (!data) return;
    if (!savedView && location.hash !== "#animals") return;

    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    try {
      if (savedView) {
        window.scrollTo(0, savedView.scrollY);
      } else {
        document.getElementById("animals")?.scrollIntoView();
      }
    } finally {
      root.style.scrollBehavior = previousScrollBehavior;
    }
    // Restore only once, when the home page content first appears.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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

  if (!data) return <LoadingState />;

  return (
    <HomePage
      {...mapHomeData(data.reptiles, data.settings, locale)}
      initialShowAll={savedView?.showAll}
      initialFilter={savedView?.filter}
    />
  );
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

  if (!animal) return <LoadingState />;
  return <AnimalDetail animal={animal} />;
}

function ContactRoute() {
  const [searchParams] = useSearchParams();
  const animalId = searchParams.get("animalId");
  const { locale } = useLocale();
  const [animal, setAnimal] = useState<SanityReptile | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(animalId));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!animalId) {
      setAnimal(null);
      setHasError(false);
      setIsLoading(false);
      return;
    }

    let isActive = true;
    setIsLoading(true);
    setHasError(false);

    sanityClient
      .fetch<SanityReptile | null>(reptileByIdQuery, { id: animalId })
      .then((result) => {
        if (isActive) {
          setAnimal(result);
          setHasError(!result);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isActive) {
          setHasError(true);
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [animalId]);

  if (isLoading) return <LoadingState />;

  if (hasError) {
    const contactTranslations = getTranslations(locale).contact;

    return (
      <main className="contact-page">
        <p>{contactTranslations.loadError}</p>
        <Link className="text-link dark" to="/">
          {contactTranslations.backToCollection}
        </Link>
      </main>
    );
  }

  return <ContactForm animal={animal ?? undefined} />;
}

function GuideRoute() {
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

  if (!guide) return <LoadingState />;

  return <GuideDetailPage guide={guide} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/guides" element={<GuidesRoute />} />
      <Route path="/guides/:id" element={<GuideRoute />} />
      <Route path="/animal/:name" element={<AnimalRoute />} />
      <Route path="/contact" element={<ContactRoute />} />
      <Route path="*" element={<HomeRoute />} />
    </Routes>
  );
}
