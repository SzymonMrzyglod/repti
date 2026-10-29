import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { guideByIdQuery, sanityClient } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

type Localized = { pl?: string; en?: string }
type Block = { _type?: string; children?: { text?: string }[] }
type Guide = { _id: string; title?: Localized; excerpt?: Localized; category?: Localized; readingTime?: string; body?: Block[]; imageUrl?: string }
const text = (value: Localized | undefined) => value?.pl || value?.en || ''

export default async function GuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const guide = await sanityClient.fetch<Guide | null>(guideByIdQuery, { id })
  if (!guide) notFound()
  const body = guide.body?.map((block) => block.children?.map((child) => child.text || '').join('')).filter(Boolean) || []
  const imageSrc = guide.imageUrl || '/images/guides/terrarium.png'
  return <main className="guide-detail-page"><header className="guides-header"><Link href="/poradniki" className="text-link dark"><ArrowLeft size={15} /> Wróć do poradników</Link><Link href="/" className="guides-brand">O TY<br /><em>GADZIE!</em></Link></header><article className="guide-detail"><p className="eyebrow dark"><span /> {text(guide.category) || 'PORADNIK'} {guide.readingTime ? `· ${guide.readingTime}` : ''}</p><h1>{text(guide.title)}</h1><p className="guide-detail-lead">{text(guide.excerpt)}</p><img className="guide-detail-image" src={imageSrc} alt="" /><div className="guide-body">{body.length ? body.map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p>Pełna treść tego poradnika zostanie wkrótce uzupełniona w CMS.</p>}</div></article></main>
}
