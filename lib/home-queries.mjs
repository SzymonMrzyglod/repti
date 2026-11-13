export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  brandName, "logoUrl": logo.asset->url,
  navigation[]{_key, href, label{pl, en}},
  heroEyebrow{pl, en}, heroTitle{pl, en}, heroText{pl, en}, "heroImageUrl": heroImage.asset->url + "?auto=format&fit=max&w=2200&q=84",
  historyEyebrow{pl, en}, historyTitle{pl, en}, historyLead{pl, en}, historyText{pl, en},
  stats[]{_key, value, label{pl, en}},
  collectionEyebrow{pl, en}, collectionTitle{pl, en}, collectionNote{pl, en},
  careEyebrow{pl, en}, careTitle{pl, en}, careText{pl, en},
  footerText{pl, en}, seoTitle{pl, en}, seoDescription{pl, en}
}`;

export const reptilesQuery = `*[_type == "reptile"] | order(coalesce(featured, false) desc, order asc, _createdAt asc) {
  _id, name{pl, en}, "speciesId": species._ref, "speciesName": species->name, "speciesLatinName": species->latinName, "species": species->name.pl,   latinName, morph{pl, en}, sex{pl, en}, weight, price, featured, status,
  description{pl, en}, "imageUrl": coalesce(image.asset->url + "?auto=format&fit=crop&w=1000&q=84", gallery[0].asset->url + "?auto=format&fit=crop&w=1000&q=84")
}`;
