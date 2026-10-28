import NoctuaHome from '@/components/noctua-home'
import { reptilesQuery, sanityClient } from '@/lib/sanity'

type SanityReptile = {
  name?: string
  species?: string
  status?: 'available' | 'reserved' | 'adopted'
  description?: string
  imageUrl?: string
}

const fallbackAnimals = [
  { name: 'Luna', species: 'Gekon orzęsiony' as const, latin: 'Correlophus ciliatus', morph: 'Harlequin', sex: 'Samica', weight: '48 g', status: 'Dostępny' as const, image: '/images/gecko-luna.png' },
  { name: 'Ember', species: 'Wąż zbożowy' as const, latin: 'Pantherophis guttatus', morph: 'Lavender Tessera', sex: 'Samica', weight: '312 g', status: 'Dostępny' as const, image: '/images/snake-ember.png' },
  { name: 'Moss', species: 'Gekon orzęsiony' as const, latin: 'Correlophus ciliatus', morph: 'Olive Dalmatian', sex: 'Samiec', weight: '36 g', status: 'Rezerwacja' as const, image: '/images/gecko-moss.png' },
]

export default async function Page() {
  const entries = await sanityClient.fetch<SanityReptile[]>(reptilesQuery).catch(() => [])
  const animals = entries.length
    ? entries.map((entry, index) => ({
        name: entry.name ?? 'Nowy podopieczny',
        species: entry.species?.toLowerCase().includes('wąż') ? 'Wąż zbożowy' as const : 'Gekon orzęsiony' as const,
        latin: entry.species?.toLowerCase().includes('wąż') ? 'Pantherophis guttatus' : 'Correlophus ciliatus',
        morph: entry.description?.split('·')[0]?.trim() || 'Do uzupełnienia',
        sex: 'Do uzupełnienia',
        weight: 'Do uzupełnienia',
        status: entry.status === 'reserved' ? 'Rezerwacja' as const : 'Dostępny' as const,
        image: entry.imageUrl || fallbackAnimals[index % fallbackAnimals.length].image,
      }))
    : fallbackAnimals

  return <NoctuaHome animals={animals} />
}
