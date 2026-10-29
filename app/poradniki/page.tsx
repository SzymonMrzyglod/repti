import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { guidesQuery, sanityClient } from '@/lib/sanity'

type Localized = { pl?: string; en?: string }
type Guide = { _id: string; title?: Localized; excerpt?: Localized; category?: Localized; readingTime?: string; imageUrl?: string }
const text = (value: Localized | undefined) => value?.pl || value?.en || ''

export default async function GuidesPage() {
  const guides = await sanityClient.fetch<Guide[]>(guidesQuery).catch(() => [])
  return <main className="guides-page"><header className="guides-header"><Link href="/" className="text-link dark"><ArrowLeft size={15} /> Wróć na stronę główną</Link><Link href="/" className="guides-brand">O TY<br /><em>GADZIE!</em></Link></header><section className="guides-intro"><p className="eyebrow dark"><span /> Wiedza i opieka</p><h1>Poradniki dla<br /><i>dobrego startu.</i></h1><p>Praktyczna wiedza o gatunkach, terrariach i codziennej opiece. Wszystko, co warto wiedzieć przed odbiorem i po nim.</p></section><section className="guides-grid" aria-label="Lista poradników">{guides.map((guide) => <article className="guide-card" key={guide._id}>{guide.imageUrl ? <img src={guide.imageUrl} alt="" /> : <div className="guide-card-image" /> }<div className="guide-card-copy"><p className="guide-meta">{text(guide.category) || 'PORADNIK'} {guide.readingTime ? `· ${guide.readingTime}` : ''}</p><h2>{text(guide.title)}</h2><p>{text(guide.excerpt)}</p><a href={`#${guide._id}`} className="text-link dark">Czytaj poradnik <ArrowUpRight size={15} /></a></div></article>)}</section>{guides.length === 0 && <p className="guides-empty">Poradniki pojawią się tutaj po dodaniu ich w CMS.</p>}</main>
}
