import {
  useLayoutEffect,
  useState,
  useEffect,
  useRef,
} from "react";
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
import LoadError from "@/components/layout/load-error";
import NotFoundPage from "@/components/layout/not-found-page";
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
import { localizedText } from "@/lib/localized";
import { mapHomeData, type HomeData, type HomeSettings, type SanityReptile } from "@/lib/home-data";
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
import { localizedRichTextPlainText } from "@/components/ui/rich-text";
import {
  clearGuidesListScrollRestore,
  requestGuidesListScrollRestore,
} from "@/lib/guides-view-state";

function HomeRoute() {
  const { locale } = useLocale();
  const location = useLocation();
  const translations = getTranslations(locale);
  const [savedView] = useState(getHomeViewState);
  const [data, setData] = useState<HomeData | null>(() => {
    const snapshot = document.getElementById("home-snapshot");
    if (!snapshot?.textContent) return null;
    try {
      const value: HomeData = JSON.parse(snapshot.textContent);
      if (!value || !Array.isArray(value.reptiles) || !value.settings || typeof value.settings !== "object") {
        throw new Error("Invalid homepage snapshot");
      }
      return value;
    } catch (error) {
      console.error("Could not read the prerendered homepage snapshot", error);
      return null;
    }
  });
  const [hasError, setHasError] = useState(false);
  const [refreshFailed, setRefreshFailed] = useState(false);

  useLayoutEffect(() => {
    if (!data) return;
    const hashTarget = location.hash
      ? document.getElementById(decodeURIComponent(location.hash.slice(1)))
      : null;
    if (!savedView && !hashTarget) return;

    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    try {
      if (hashTarget) {
        hashTarget.scrollIntoView();
      } else if (savedView) {
        window.scrollTo(0, savedView.scrollY);
      }
    } finally {
      root.style.scrollBehavior = previousScrollBehavior;
    }
    // Restore only once, when the home page content first appears.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    let isActive = true;
    document.getElementById("home-snapshot")?.remove();
    const hasSnapshot = data !== null;

    Promise.all([
      sanityClient.fetch<SanityReptile[]>(reptilesQuery),
      sanityClient.fetch<HomeSettings | null>(siteSettingsQuery),
    ])
      .then(([reptiles, settings]) => {
        if (isActive) {
          setData({ reptiles, settings: settings || {} });
        }
      })
      .catch((error: unknown) => {
        console.error("Could not refresh homepage content", error);
        if (isActive) {
          if (hasSnapshot) setRefreshFailed(true);
          else setHasError(true);
        }
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
            ? "Gekony orzęsione i węże zbożowe — hodowla Śląsk | O ty gadzie!"
            : "O ty gadzie! — Passionate gecko and snake breeder")
        }
        description={
          localizedText(data.settings?.seoDescription, locale) ||
          (locale === "pl"
            ? "Hodowla gekonów orzęsionych i węży zbożowych w Jastrzębiu-Zdroju na Śląsku. Poznaj nasze zwierzęta, poradniki i wsparcie dla przyszłych opiekunów."
            : "O ty gadzie! — responsible breeding of crested geckos and corn snakes in Jastrzębie-Zdrój, Poland. Healthy animals, reliable care knowledge and support.")
        }
        path="/"
        image={data.settings?.heroImageUrl}
      />
      {refreshFailed && (
        <p role="alert" className="fixed inset-x-0 bottom-0 z-[60] m-0 bg-ivory px-[5vw] py-3 text-ink shadow-lg">
          {translations.home.snapshotWarning}
        </p>
      )}
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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true;

    sanityClient
      .fetch<Guide[]>(guidesQuery)
      .then((result) => {
        if (isActive) {
          setGuides(result);
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
  }, []);

  if (isLoading) return <LoadingState />;
  if (hasError) return <LoadError />;

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
        path="/guides/"
      />
      <GuidesPage guides={guides} />
    </>
  );
}

function AnimalRoute() {
  const { name } = useParams();
  const { locale } = useLocale();
  const [animal, setAnimal] = useState<SanityReptile | null>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "not-found" | "error"
  >("loading");

  useEffect(() => {
    if (!name) return;

    let isActive = true;
    setAnimal(null);
    setStatus("loading");

    sanityClient
      .fetch<SanityReptile | null>(reptileByIdQuery, { id: name })
      .then((result) => {
        if (!isActive) return;
        setAnimal(result);
        setStatus(result ? "ready" : "not-found");
      })
      .catch(() => {
        if (isActive) setStatus("error");
      });

    return () => {
      isActive = false;
    };
  }, [name]);

  if (status === "not-found") return <NotFoundPage />;
  if (status === "error") return <LoadError />;
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
        path={`/animal/${animal._id}/`}
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
              url: absoluteUrl(`/animal/${animal._id}/`),
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
        path="/contact/"
        noindex
      />
      <ContactForm animal={animal ?? undefined} />
    </>
  );
}

function GuideRoute() {
  const { id } = useParams();
  const { locale } = useLocale();
  const [guide, setGuide] = useState<Guide | null>(() => {
    const snapshot = document.getElementById("guide-snapshot");
    if (!snapshot?.textContent) return null;
    try {
      const value: Guide = JSON.parse(snapshot.textContent);
      return value?._id === id ? value : null;
    } catch (error) {
      console.error("Could not read the prerendered guide snapshot", error);
      return null;
    }
  });
  const [status, setStatus] = useState<
    "loading" | "ready" | "not-found" | "error"
  >(guide ? "ready" : "loading");
  const [refreshFailed, setRefreshFailed] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isActive = true;
    document.getElementById("guide-snapshot")?.remove();
    const hasSnapshot = guide?._id === id;
    if (!hasSnapshot) {
      setGuide(null);
      setStatus("loading");
    }
    setRefreshFailed(false);

    sanityClient
      .fetch<Guide | null>(guideByIdQuery, { id })
      .then((result) => {
        if (!isActive) return;
        setGuide(result);
        setStatus(result ? "ready" : "not-found");
      })
      .catch(() => {
        if (isActive) {
          if (hasSnapshot) setRefreshFailed(true);
          else setStatus("error");
        }
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  if (status === "not-found") return <NotFoundPage />;
  if (status === "error") return <LoadError />;
  if (status !== "ready" || !guide || guide._id !== id) return <LoadingState />;

  const guideTitle = localizedText(guide.title, locale);
  const guideDescription =
    truncate(localizedRichTextPlainText(guide.excerpt, locale)) ||
    (locale === "pl" ? "Poradnik hodowcy gadów." : "Reptile breeder's guide.");

  return (
    <>
      <Seo
        title={`${guideTitle} | ${SITE_NAME}`}
        description={guideDescription}
        path={`/guides/${guide._id}/`}
        image={guide.imageUrl}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guideTitle,
          description: guideDescription,
          image: guide.imageUrl,
          mainEntityOfPage: absoluteUrl(`/guides/${guide._id}/`),
          author: { "@type": "Organization", name: SITE_NAME },
          publisher: { "@type": "Organization", name: SITE_NAME },
        }}
      />
      {refreshFailed && (
        <p role="alert" className={`${pageShellClassName} text-ink`}>
          {getTranslations(locale).guides.snapshotWarning}
        </p>
      )}
      <GuideDetailPage guide={guide} />
    </>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const previousPathname = useRef(pathname);

  useLayoutEffect(() => {
    const previousPath = previousPathname.current;
    if (previousPath === pathname) return;
    previousPathname.current = pathname;

    const currentRoute = pathname.replace(/\/+$/, "");
    const previousRoute = previousPath.replace(/\/+$/, "");
    if (currentRoute === "/guides" && previousRoute.startsWith("/guides/")) {
      requestGuidesListScrollRestore();
      return;
    }

    if (currentRoute !== "/guides" && !currentRoute.startsWith("/guides/")) return;
    clearGuidesListScrollRestore();

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
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
