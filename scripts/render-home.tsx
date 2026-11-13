import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import HomePage from "@/components/home/home-page";
import { mapHomeData, type HomeData } from "@/lib/home-data";
import { LocaleProvider } from "@/lib/locale-context";

export function renderHome(data: HomeData) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={["/"]}>
      <LocaleProvider>
        <HomePage {...mapHomeData(data.reptiles, data.settings, "pl")} />
      </LocaleProvider>
    </MemoryRouter>,
  );
}
