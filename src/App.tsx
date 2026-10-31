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
import Seo from "@/components/seo";
import {
  GuideDetailPage,
  GuidesPage,
  type Guide,
} from "@/components/guides/guide-pages";
import HomePage from "@/components/home/home-page";
import {
  pageShellClassName,
  spacedTextLinkClassName,
} from "@/components/ui/styles";
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
import { SITE_NAME, absoluteUrl, truncate } from "@/lib/seo";
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
  price?: string;
  featured?: boolean;
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
      price: reptile.price || "",
      featured: Boolean(reptile.featured),
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
    return <main className="mx-auto max-w-[1240px] px-[5vw] py-8">{translations.home.loadError}</main>;
  }

  if (!data) return <LoadingState />;

  return (
    <>
      <Seo
        title={
          localizedText(data.settings?.seoTitle, locale) ||
          (locale === "pl"
            ? "O ty gadzie! — Hodowla gekonów i węży z pasją"
            : "O ty gadzie! — Passionate gecko and snake breeder")
        }
        description={
          localizedText(data.settings?.seoDescription, locale) ||
          (locale === "pl"
            ? "O ty gadzie! — świadoma hodowla gekonów orzęsionych i węży zbożowych w Jastrzębiu-Zdroju. Zdrowe zwierzęta, rzetelna wiedza i wsparcie na start."
            : "O ty gadzie! — responsible breeding of crested geckos and corn snakes in Jastrzębie-Zdrój, Poland. Healthy animals, reliable care knowledge and support.")
        }
        path="/"
        image={data.settings?.heroImageUrl}
      />
      <HomePage
        {...mapHomeData(data.reptiles, data.settings, locale)}
        initialShowAll={savedView?.showAll}
        initialFilter={savedView?.filter}
      />
    </>
  );
}

function GuidesRoute() {
  const { locale } = useLocale();
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

  return (
    <>
      <Seo
        title={
          locale === "pl"
            ? `Poradniki o opiece nad gadami | ${SITE_NAME}`
            : `Reptile care guides | ${SITE_NAME}`
        }
        description={
          locale === "pl"
            ? "Poradniki hodowcy: terrarium, żywienie i pierwsze dni gekona orzęsionego oraz węża zbożowego w nowym domu."
            : "Breeder's guides: terrarium setup, feeding and the first days of a crested gecko or corn snake in a new home."
        }
        path="/guides"
      />
      <GuidesPage guides={guides} />
    </>
  );
}

function AnimalRoute() {
  const { name } = useParams();
  const { locale } = useLocale();
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

  const animalName = localizedText(animal.name, locale).trim();
  const animalMorph = localizedText(animal.morph, locale);
  const animalSpecies = animal.species || "";
  const animalTitle = [animalName, animalMorph].filter(Boolean).join(" — ");
  const animalDescription =
    truncate(localizedText(animal.description, locale)) ||
    [animalName, animalMorph, animalSpecies, animal.latinName]
      .filter(Boolean)
      .join(", ");
  const numericPrice = Number.parseFloat(
    (animal.price || "").replace(/\s/g, "").replace(",", "."),
  );

  return (
    <>
      <Seo
        title={`${animalTitle || SITE_NAME} | ${SITE_NAME}`}
        description={animalDescription}
        path={`/animal/${animal._id}`}
        image={animal.imageUrl}
        type="product"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: animalTitle,
          description: animalDescription,
          image: animal.imageUrl,
          category: animalSpecies,
          brand: { "@type": "Brand", name: SITE_NAME },
          ...(Number.isFinite(numericPrice) && {
            offers: {
              "@type": "Offer",
              url: absoluteUrl(`/animal/${animal._id}`),
              price: numericPrice,
              priceCurrency: "PLN",
              availability:
                animal.status === "available"
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
          }),
        }}
      />
      <AnimalDetail animal={animal} />
    </>
  );
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
      <main className={`${pageShellClassName} pb-20 max-[760px]:pt-[18px] max-[760px]:pb-12`}>
        <p>{contactTranslations.loadError}</p>
        <Link className={`${spacedTextLinkClassName} text-forest`} to="/">
          {contactTranslations.backToCollection}
        </Link>
      </main>
    );
  }

  return (
    <>
      <Seo
        title={`${getTranslations(locale).contact.title} | ${SITE_NAME}`}
        description={getTranslations(locale).contact.introduction}
        path="/contact"
        noindex
      />
      <ContactForm animal={animal ?? undefined} />
    </>
  );
}

function GuideRoute() {
  const { id } = useParams();
  const { locale } = useLocale();
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

  const guideTitle = localizedText(guide.title, locale);
  const guideDescription =
    truncate(localizedText(guide.excerpt, locale)) ||
    (locale === "pl" ? "Poradnik hodowcy gadów." : "Reptile breeder's guide.");

  return (
    <>
      <Seo
        title={`${guideTitle} | ${SITE_NAME}`}
        description={guideDescription}
        path={`/guides/${guide._id}`}
        image={guide.imageUrl}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guideTitle,
          description: guideDescription,
          image: guide.imageUrl,
          mainEntityOfPage: absoluteUrl(`/guides/${guide._id}`),
          author: { "@type": "Organization", name: SITE_NAME },
          publisher: { "@type": "Organization", name: SITE_NAME },
        }}
      />
      <GuideDetailPage guide={guide} />
    </>
  );
}

export default function App() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (pathname !== "/guides" && !pathname.startsWith("/guides/")) return;

    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previousScrollBehavior;
  }, [pathname]);

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
