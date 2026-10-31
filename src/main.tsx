import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./global.css";
import { clearHomeViewState } from "@/lib/home-view-state";
import { LocaleProvider } from "@/lib/locale-context";

const navigationEntry = performance.getEntriesByType("navigation")[0] as
  | PerformanceNavigationTiming
  | undefined;

// A full page reload starts from a clean state: no saved scroll, filter or
// expanded collection, and no browser scroll restoration or URL hash.
if (navigationEntry?.type === "reload") {
  clearHomeViewState();
  history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  if (window.location.hash) {
    history.replaceState(
      history.state,
      "",
      window.location.pathname + window.location.search,
    );
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </BrowserRouter>
  </StrictMode>,
);
