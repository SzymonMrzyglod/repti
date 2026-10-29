import { notFound } from 'next/navigation'
import AnimalDetail from '@/components/animal-detail'
import { reptileByNameQuery, sanityClient } from '@/lib/sanity'

type Params = { params: Promise<{ name: string }> }

export default async function AnimalPage({ params }: Params) {
  const { name } = await params
  const animal = await sanityClient.fetch(reptileByNameQuery, { name: decodeURIComponent(name) }).catch(() => null)
  if (!animal) notFound()
  return <AnimalDetail animal={animal} />
}
