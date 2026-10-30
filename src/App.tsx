import { useEffect, useState, type ComponentProps } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import AnimalDetail from "../components/animal-detail";
import NoctuaHome from "../components/noctua-home";
import { guidesQuery, guideByIdQuery, reptilesQuery, sanityClient, siteSettingsQuery } from "../lib/sanity";

type Localized = { pl?: string; en?: string };
type SanityReptile = { _id: string; name?: Localized; species?: string; latinName?: string; morph?: Localized; sex?: Localized; weight?: string; status?: string; description?: Localized; price?: string; imageUrl?: string };
type SanityGuide = { _id: string; title?: Localized; excerpt?: Localized; category?: Localized; readingTime?: string; imageUrl?: string; body?: string };
type Settings = ComponentProps<typeof NoctuaHome>["settings"];

type HomeData = { reptiles: SanityReptile[]; settings: Settings };
const text = (value?: Localized) => value?.pl || value?.en || "";
const fallbackImages = ["/images/guides/terrarium.png", "/images/guides/feeding.png", "/images/guides/homecoming.png"];

function mapHomeData(reptiles: SanityReptile[], settings: Settings): ComponentProps<typeof NoctuaHome> {
  return {
    settings,
    animals: reptiles.map((entry) => ({
      id: entry._id,
      name: text(entry.name),
      species: entry.species || "",
      latinName: entry.latinName || "",
      morph: text(entry.morph),
      sex: text(entry.sex),
      weight: entry.weight || "",
      status: entry.status === "reserved" ? "Rezerwacja" : entry.status === "adopted" ? "Adoptowany" : "Dostępny",
      description: text(entry.description),
      price: entry.price || "",
      imageUrl: entry.imageUrl || "",
    })),
  };
}

function HomeRoute() {
  const [data, setData] = useState<HomeData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      sanityClient.fetch<SanityReptile[]>(reptilesQuery),
      sanityClient.fetch<Settings | null>(siteSettingsQuery),
    ])
      .then(([reptiles, settings]) => setData({ reptiles, settings: settings || {} }))
      .catch(() => setError(true));
  }, []);

  if (error) return <main className="guides-empty">Nie udało się załadować danych. Spróbuj ponownie.</main>;
  if (!data) return <main className="guides-empty">Ładowanie…</main>;
  return <NoctuaHome {...mapHomeData(data.reptiles, data.settings)} />;
}

function GuidesRoute() {
  const [guides, setGuides] = useState<SanityGuide[]>([]);
  useEffect(() => { sanityClient.fetch<SanityGuide[]>(guidesQuery).then(setGuides); }, []);
  return (
    <main className="guides-page">
      <header className="guides-header"><Link to="/" className="text-link dark"><ArrowLeft size={15} /> Wróć na stronę główną</Link><Link to="/" className="guides-brand">O TY<br /><em>GADZIE!</em></Link></header>
      <section className="guides-intro"><p className="eyebrow dark"><span /> Wiedza i opieka</p><h1>Poradniki dla<br /><i>dobrego startu.</i></h1><p>Praktyczna wiedza o gatunkach, terrariach i codziennej opiece. Wszystko, co warto wiedzieć przed odbiorem i po nim.</p></section>
      <section className="guides-grid" aria-label="Lista poradników">
        {guides.map((guide, index) => <article className="guide-card" key={guide._id}><img src={guide.imageUrl || fallbackImages[index % fallbackImages.length]} alt="" /><div className="guide-card-copy"><p className="guide-meta">{text(guide.category) || "PORADNIK"} {guide.readingTime ? `· ${guide.readingTime}` : ""}</p><h2>{text(guide.title)}</h2><p>{text(guide.excerpt)}</p><Link to={`/guides/${guide._id}`} className="text-link dark">Czytaj poradnik <ArrowUpRight size={15} /></Link></div></article>)}
      </section>
      {guides.length === 0 && <p className="guides-empty">Poradniki pojawią się tutaj po dodaniu ich w CMS.</p>}
    </main>
  );
}

function AnimalRoute() {
  const { name } = useParams();
  const [animal, setAnimal] = useState<SanityReptile | null>(null);
  useEffect(() => { if (name) sanityClient.fetch<SanityReptile | null>("*[_type == 'reptile' && _id == $id][0]", { id: name }).then(setAnimal); }, [name]);
  if (!animal) return <main className="guides-empty">Ładowanie…</main>;
  return <AnimalDetail animal={animal} />;
}

function GuideRoute() {
  const { id } = useParams();
  const [guide, setGuide] = useState<SanityGuide | null>(null);
  useEffect(() => { if (id) sanityClient.fetch<SanityGuide | null>(guideByIdQuery, { id }).then(setGuide); }, [id]);
  if (!guide) return <main className="guides-empty">Ładowanie…</main>;
  return <main className="guides-page"><header className="guides-header"><Link to="/guides" className="text-link dark"><ArrowLeft size={15} /> Wróć do poradników</Link></header><article className="guide-detail"><p className="eyebrow dark"><span /> {text(guide.category) || "PORADNIK"}</p><h1>{text(guide.title)}</h1><p>{text(guide.excerpt)}</p>{guide.body && <div className="guide-body">{guide.body}</div>}</article></main>;
}

export default function App() {
  return <Routes><Route path="/" element={<HomeRoute />} /><Route path="/guides" element={<GuidesRoute />} /><Route path="/guides/:id" element={<GuideRoute />} /><Route path="/animal/:name" element={<AnimalRoute />} /><Route path="*" element={<HomeRoute />} /></Routes>;
}
