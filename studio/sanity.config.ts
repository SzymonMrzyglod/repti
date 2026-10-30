import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "default",
  title: "O ty gadzie! CMS v2",
  projectId: "t5to691s",
  dataset: "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.documentTypeListItem("reptile").title("Reptiles"),
            S.documentTypeListItem("species").title("Species"),
            S.documentTypeListItem("guide").title("Guides"),
            S.listItem()
              .title("Site settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings"),
              ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
