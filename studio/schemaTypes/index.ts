import { defineArrayMember, defineField, defineType } from "sanity";

const localizedString = defineType({
  name: "localizedString",
  title: "Localized string",
  type: "object",
  fields: [
    defineField({ name: "pl", title: "Polish", type: "string" }),
    defineField({ name: "en", title: "English", type: "string" }),
  ],
});

const localizedText = defineType({
  name: "localizedText",
  title: "Localized text",
  type: "object",
  fields: [
    defineField({ name: "pl", title: "Polish", type: "text" }),
    defineField({ name: "en", title: "English", type: "text" }),
  ],
});

const species = defineType({
  name: "species",
  title: "Species",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "localizedString" }),
    defineField({ name: "latinName", title: "Latin name", type: "string" }),
  ],
  preview: {
    select: { title: "name.pl", subtitle: "latinName" },
  },
});

const reptile = defineType({
  name: "reptile",
  title: "Reptile",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "localizedString" }),
    defineField({
      name: "species",
      title: "Species",
      type: "reference",
      to: [{ type: "species" }],
    }),
    defineField({
      name: "latinName",
      title: "Latin name override",
      type: "string",
    }),
    defineField({ name: "morph", title: "Morph", type: "localizedString" }),
    defineField({ name: "sex", title: "Sex", type: "localizedString" }),
    defineField({ name: "weight", title: "Weight", type: "string" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Reserved", value: "reserved" },
          { title: "Adopted", value: "adopted" },
        ],
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localizedText",
    }),
    defineField({ name: "price", title: "Price", type: "string" }),
    defineField({ name: "featured", title: "Featured", type: "boolean" }),
    defineField({ name: "image", title: "Cover image", type: "image" }),
    defineField({
      name: "gallery",
      title: "Photo gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  preview: {
    select: {
      title: "name.pl",
      subtitle: "species.name.pl",
      media: "image",
    },
  },
});

const guide = defineType({
  name: "guide",
  title: "Guide",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "localizedString" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.pl" },
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "localizedText" }),
    defineField({
      name: "category",
      title: "Category",
      type: "localizedString",
    }),
    defineField({ name: "readingTime", title: "Reading time", type: "string" }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "bodyEn",
      title: "Body (English)",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({ name: "image", title: "Image", type: "image" }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  preview: {
    select: { title: "title.pl", subtitle: "category.pl", media: "image" },
  },
});

const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "brandName", title: "Brand name", type: "string" }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({
      name: "navigation",
      title: "Navigation",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "href", title: "Link", type: "string" }),
            defineField({
              name: "label",
              title: "Label",
              type: "localizedString",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "heroEyebrow",
      title: "Hero eyebrow",
      type: "localizedString",
    }),
    defineField({
      name: "heroTitle",
      title: "Hero title",
      type: "localizedString",
    }),
    defineField({
      name: "heroText",
      title: "Hero text",
      type: "localizedText",
    }),
    defineField({ name: "heroImage", title: "Hero image", type: "image" }),
    defineField({
      name: "historyEyebrow",
      title: "History eyebrow",
      type: "localizedString",
    }),
    defineField({
      name: "historyTitle",
      title: "History title",
      type: "localizedString",
    }),
    defineField({
      name: "historyLead",
      title: "History lead",
      type: "localizedText",
    }),
    defineField({
      name: "historyText",
      title: "History text",
      type: "localizedText",
    }),
    defineField({
      name: "stats",
      title: "Statistics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", title: "Value", type: "string" }),
            defineField({
              name: "label",
              title: "Label",
              type: "localizedString",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "collectionEyebrow",
      title: "Collection eyebrow",
      type: "localizedString",
    }),
    defineField({
      name: "collectionTitle",
      title: "Collection title",
      type: "localizedString",
    }),
    defineField({
      name: "collectionNote",
      title: "Collection note",
      type: "localizedText",
    }),
    defineField({
      name: "careEyebrow",
      title: "Care eyebrow",
      type: "localizedString",
    }),
    defineField({
      name: "careTitle",
      title: "Care title",
      type: "localizedString",
    }),
    defineField({
      name: "careText",
      title: "Care text",
      type: "localizedText",
    }),
    defineField({
      name: "footerText",
      title: "Footer text",
      type: "localizedText",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "localizedString",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "localizedText",
    }),
  ],
});

export const schemaTypes = [
  localizedString,
  localizedText,
  species,
  reptile,
  guide,
  siteSettings,
];
