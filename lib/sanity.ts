import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'por5jwj3',
  dataset: 'production',
  apiVersion: '2026-10-28',
  useCdn: true,
})

export const reptilesQuery = `*[_type == "reptile"] | order(order asc, _createdAt asc) {
  name,
  species,
  status,
  price,
  description,
  featured,
  image,
  "imageUrl": image.asset->url
}`
