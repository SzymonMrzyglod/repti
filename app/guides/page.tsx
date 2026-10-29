import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { guidesQuery, sanityClient } from "@/lib/sanity";

export const dynamic = "force-dynamic";

type Localized = { pl?: string; en?: string };
type Guide = {
  _id: string;
  title?: Localized;
  excerpt?: Localized;
  category?: Localized;
  readingTime?: string;
  imageUrl?: string;
};
const text = (value: Localized | undefined) => value?.pl || value?.en || "";

export default async function GuidesPage() {
  const guides = await sanityClient.fetch<Guide[]>(guidesQuery);
  return (
    <main className="guides-page">
      <header className="guides-header">
        <Link href="/" className="text-link dark">
          <ArrowLeft size={15} /> Wróć na stronę główną
        </Link>
        <Link href="/" className="guides-brand">
          O TY
          <br />
          <em>GADZIE!</em>
        </Link>
      </header>
      <section className="guides-intro">
        <p className="eyebrow dark">
          <span /> Wiedza i opieka
        </p>
        <h1>
          Poradniki dla
          <br />
          <i>dobrego startu.</i>
        </h1>
        <p>
          Praktyczna wiedza o gatunkach, terrariach i codziennej opiece.
          Wszystko, co warto wiedzieć przed odbiorem i po nim.
        </p>
      </section>
      <section className="guides-grid" aria-label="Lista poradników">
        {guides.map((guide, index) => {
          const fallbackImages = [
            "/images/guides/terrarium.png",
            "/images/guides/feeding.png",
            "/images/guides/homecoming.png",
          ];
          const imageSrc =
            guide.imageUrl || fallbackImages[index % fallbackImages.length];
          return (
            <article className="guide-card" key={guide._id}>
              <img src={imageSrc} alt="" />
              <div className="guide-card-copy">
                <p className="guide-meta">
                  {text(guide.category) || "PORADNIK"}{" "}
                  {guide.readingTime ? `· ${guide.readingTime}` : ""}
                </p>
                <h2>{text(guide.title)}</h2>
                <p>{text(guide.excerpt)}</p>
                <Link
                  href={`/poradniki/${guide._id}`}
                  className="text-link dark"
                >
                  Czytaj poradnik <ArrowUpRight size={15} />
                </Link>
              </div>
            </article>
          );
        })}
      </section>
      {guides.length === 0 && (
        <p className="guides-empty">
          Poradniki pojawią się tutaj po dodaniu ich w CMS.
        </p>
      )}
    </main>
  );
}
