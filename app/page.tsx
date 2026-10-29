import NoctuaHome from '@/components/noctua-home'
import { reptilesQuery, sanityClient, siteSettingsQuery } from '@/lib/sanity'

type Locale = 'pl' | 'en'
type Localized = { pl?: string; en?: string }

type SanityReptile = {
  name?: Localized
  species?: string
  latinName?: string
  morph?: Localized
  sex?: Localized
  weight?: string
  status?: 'available' | 'reserved' | 'adopted'
  imageUrl?: string
}

type SanitySettings = {
  heroEyebrow?: Localized; heroTitle?: Localized; heroText?: Localized
  historyEyebrow?: Localized; historyTitle?: Localized; historyLead?: Localized; historyText?: Localized
  collectionEyebrow?: Localized; collectionTitle?: Localized; collectionNote?: Localized
  careEyebrow?: Localized; careTitle?: Localized; careText?: Localized
}

const fallbackAnimals = [
  { name: 'Luna', species: 'Gekon orzęsiony' as const, latin: 'Correlophus ciliatus', morph: 'Harlequin', sex: 'Samica', weight: '48 g', status: 'Dostępny' as const, image: '/images/gecko-luna.png' },
  { name: 'Ember', species: 'Wąż zbożowy' as const, latin: 'Pantherophis guttatus', morph: 'Lavender Tessera', sex: 'Samica', weight: '312 g', status: 'Dostępny' as const, image: '/images/snake-ember.png' },
  { name: 'Moss', species: 'Gekon orzęsiony' as const, latin: 'Correlophus ciliatus', morph: 'Olive Dalmatian', sex: 'Samiec', weight: '36 g', status: 'Rezerwacja' as const, image: '/images/gecko-moss.png' },
]

const text = (value: Localized | undefined, locale: Locale, fallback: string) => value?.[locale] || value?.pl || value?.en || fallback

export default async function Page() {
  const [entries, settings] = await Promise.all([
    sanityClient.fetch<SanityReptile[]>(reptilesQuery).catch(() => []),
    sanityClient.fetch<SanitySettings | null>(siteSettingsQuery).catch(() => null),
  ])
  const animals = entries.length ? entries.map((entry, index) => ({
    name: text(entry.name, 'pl', 'Nowy podopieczny'),
    species: entry.species?.toLowerCase().includes('wąż') ? 'Wąż zbożowy' as const : 'Gekon orzęsiony' as const,
    latin: entry.latinName || (entry.species?.toLowerCase().includes('wąż') ? 'Pantherophis guttatus' : 'Correlophus ciliatus'),
    morph: text(entry.morph, 'pl', 'Do uzupełnienia'), sex: text(entry.sex, 'pl', 'Do uzupełnienia'),
    weight: entry.weight || 'Do uzupełnienia', status: entry.status === 'reserved' ? 'Rezerwacja' as const : 'Dostępny' as const,
    image: entry.imageUrl || fallbackAnimals[index % fallbackAnimals.length].image,
  })) : fallbackAnimals

  return <NoctuaHome animals={animals} settings={settings} />
}
