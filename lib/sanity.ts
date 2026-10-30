import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "t5to691s",
  dataset: "production",
  apiVersion: "2026-10-28",
  useCdn: true,
});

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  brandName, "logoUrl": logo.asset->url,
  navigation[]{_key, href, label{pl, en}},
  heroEyebrow{pl, en}, heroTitle{pl, en}, heroText{pl, en}, "heroImageUrl": heroImage.asset->url + "?auto=format&fit=max&w=1600&q=78",
  historyEyebrow{pl, en}, historyTitle{pl, en}, historyLead{pl, en}, historyText{pl, en},
  stats[]{_key, value, label{pl, en}},
  collectionEyebrow{pl, en}, collectionTitle{pl, en}, collectionNote{pl, en},
  careEyebrow{pl, en}, careTitle{pl, en}, careText{pl, en},
  footerText{pl, en}, seoTitle{pl, en}, seoDescription{pl, en}
}`;

export const reptileByIdQuery = `*[_type == "reptile" && _id == $id][0] {
  _id, name{pl, en}, "species": species->name.pl, "speciesLatinName": species->latinName, latinName, morph{pl, en}, sex{pl, en}, weight, status, description{pl, en}, price, featured,
  "imageUrl": coalesce(image.asset->url + "?auto=format&fit=max&w=1200&q=80", gallery[0].asset->url + "?auto=format&fit=max&w=1200&q=80"),
  "galleryUrls": gallery[]{"url": asset->url + "?auto=format&fit=max&w=1200&q=80"}[].url
}`;

export const guideByIdQuery = `*[_type == "guide" && _id == $id][0] { _id, title{pl, en}, excerpt{pl, en}, category{pl, en}, readingTime, body, bodyEn }`;

export const guidesQuery = `*[_type == "guide"] | order(order asc, _createdAt desc) { _id, title{pl, en}, excerpt{pl, en}, category{pl, en}, readingTime, "imageUrl": image.asset->url + "?auto=format&fit=crop&w=800&q=74" }`;

export const reptilesQuery = `*[_type == "reptile"] | order(order asc, _createdAt asc) {
  _id, name{pl, en}, "speciesId": species._ref, "speciesName": species->name, "speciesLatinName": species->latinName, "species": species->name.pl, latinName, morph{pl, en}, sex{pl, en}, weight, status,
  description{pl, en}, "imageUrl": coalesce(image.asset->url + "?auto=format&fit=crop&w=520&q=72", gallery[0].asset->url + "?auto=format&fit=crop&w=520&q=72")
}`;
