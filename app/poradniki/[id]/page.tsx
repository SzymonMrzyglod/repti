import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { guideByIdQuery, sanityClient } from '@/lib/sanity'

type Localized = { pl?: string; en?: string }
type Block = { _type?: string; children?: { text?: string }[] }
type Guide = { _id: string; title?: Localized; excerpt?: Localized; category?: Localized; readingTime?: string; body?: Block[]; imageUrl?: string }
const text = (value: Localized | undefined) => value?.pl || value?.en || ''

export default async function GuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const guide = await sanityClient.fetch<Guide | null>(guideByIdQuery, { id: decodeURIComponent(id) }).catch(() => null)
  if (!guide) return <main className="guides-page"><p>Nie znaleziono poradnika.</p></main>
  const body = guide.body?.map((block) => block.children?.map((child) => child.text || '').join('')).filter(Boolean) || []
  return <main className="guide-detail-page"><header className="guides-header"><Link href="/poradniki" className="text-link dark"><ArrowLeft size={15} /> Wróć do poradników</Link><Link href="/" className="guides-brand">O TY<br /><em>GADZIE!</em></Link></header><article className="guide-detail"><p className="eyebrow dark"><span /> {text(guide.category) || 'PORADNIK'} {guide.readingTime ? `· ${guide.readingTime}` : ''}</p><h1>{text(guide.title)}</h1><p className="guide-detail-lead">{text(guide.excerpt)}</p>{guide.imageUrl && <img className="guide-detail-image" src={guide.imageUrl} alt="" />}<div className="guide-body">{body.length ? body.map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p>Pełna treść tego poradnika zostanie wkrótce uzupełniona w CMS.</p>}</div></article></main>
}
