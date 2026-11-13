import { createClient } from "@sanity/client";
export { reptilesQuery, siteSettingsQuery } from "./home-queries.mjs";

export const sanityClient = createClient({
  projectId: "t5to691s",
  dataset: "production",
  apiVersion: "2026-10-28",
  useCdn: true,
});

export const reptileByIdQuery = `*[_type == "reptile" && _id == $id][0] {
  _id, name{pl, en}, "species": species->name.pl, "speciesLatinName": species->latinName, latinName, morph{pl, en}, sex{pl, en}, weight, status, description{pl, en}, price, featured,
  "imageUrl": coalesce(image.asset->url + "?auto=format&fit=max&w=1800&q=85", gallery[0].asset->url + "?auto=format&fit=max&w=1800&q=85"),
  "galleryUrls": gallery[]{"url": asset->url + "?auto=format&fit=max&w=1800&q=85"}[].url
}`;

export const guideByIdQuery = `*[_type == "guide" && _id == $id][0] {
  _id, title{pl, en}, excerpt{pl, en}, "category": categoryRef->name, "categoryId": categoryRef._ref, "speciesId": species._ref, "speciesName": species->name, readingTime, "imageUrl": image.asset->url + "?auto=format&fit=max&w=1200&q=84",
  body[]{..., "assetUrl": asset->url + "?auto=format&fit=max&w=1800&q=85"},
  bodyEn[]{..., "assetUrl": asset->url + "?auto=format&fit=max&w=1800&q=85"}
}`;

export const guidesQuery = `*[_type == "guide"] | order(order asc, _createdAt desc) { _id, title{pl, en}, excerpt{pl, en}, "category": categoryRef->name, "categoryId": categoryRef._ref, "speciesId": species._ref, "speciesName": species->name, readingTime, "imageUrl": image.asset->url + "?auto=format&fit=crop&w=1000&q=84" }`;
