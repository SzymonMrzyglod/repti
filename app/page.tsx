import NoctuaHome from '@/components/noctua-home'
import { reptilesQuery, sanityClient, siteSettingsQuery } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

type Locale = 'pl' | 'en'
type Localized = { pl?: string; en?: string }

type SanityReptile = {
  _id: string
  name?: Localized
  species?: { _ref?: string }
  speciesName?: Localized
  speciesLatinName?: string
  latinName?: string
  morph?: Localized
  sex?: Localized
  weight?: string
  status?: 'available' | 'reserved' | 'adopted'
  imageUrl?: string
  description?: Localized
}

type SanitySettings = {
  brandName?: string
  logoUrl?: string
  heroImageUrl?: string
  heroEyebrow?: Localized; heroTitle?: Localized; heroText?: Localized
  historyEyebrow?: Localized; historyTitle?: Localized; historyLead?: Localized; historyText?: Localized
  collectionEyebrow?: Localized; collectionTitle?: Localized; collectionNote?: Localized
  careEyebrow?: Localized; careTitle?: Localized; careText?: Localized
}

const text = (value: Localized | undefined, locale: Locale, fallback: string) => value?.[locale] || value?.pl || value?.en || fallback

export default async function Page() {
  const [entries, settings] = await Promise.all([
    sanityClient.fetch<SanityReptile[]>(reptilesQuery),
    sanityClient.fetch<SanitySettings | null>(siteSettingsQuery),
  ])
  const fallbackImages = ['/images/gecko-luna.png', '/images/gecko-moss.png', '/images/snake-ember.png']
  const animals = entries.length ? entries.map((entry, index) => ({
    id: entry._id,
    name: text(entry.name, 'pl', 'Nowy podopieczny'),
    species: text(entry.speciesName, 'pl', 'Bez przypisanego gatunku'),
    latin: entry.speciesLatinName || entry.latinName || '—',
    morph: text(entry.morph, 'pl', 'Do uzupełnienia'), sex: text(entry.sex, 'pl', 'Do uzupełnienia'),
    weight: entry.weight || 'Do uzupełnienia', status: entry.status === 'reserved' ? 'Rezerwacja' as const : entry.status === 'adopted' ? 'Adoptowany' as const : 'Dostępny' as const,
    image: entry.imageUrl || fallbackImages[index % fallbackImages.length],
  })) : []

  return <NoctuaHome animals={animals} settings={settings} />
}
