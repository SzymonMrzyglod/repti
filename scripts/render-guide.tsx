import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { GuideDetailPage, type Guide } from "@/components/guides/guide-pages";
import { LocaleProvider } from "@/lib/locale-context";

export function renderGuide(guide: Guide) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[`/guides/${guide._id}/`]}>
      <LocaleProvider>
        <GuideDetailPage guide={guide} />
      </LocaleProvider>
    </MemoryRouter>,
  );
}
