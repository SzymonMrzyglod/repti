export type HomeViewState = {
  scrollY: number;
  showAll: boolean;
  filter: string;
};

const storageKey = "home-view-state";

export function getHomeViewState(): HomeViewState | undefined {
  try {
    const stored = sessionStorage.getItem(storageKey);
    if (!stored) return undefined;

    const state = JSON.parse(stored) as Partial<HomeViewState>;
    if (
      typeof state.scrollY !== "number" ||
      !Number.isFinite(state.scrollY) ||
      typeof state.showAll !== "boolean" ||
      typeof state.filter !== "string"
    ) {
      return undefined;
    }

    return state as HomeViewState;
  } catch {
    return undefined;
  }
}

export function clearHomeViewState() {
  try {
    sessionStorage.removeItem(storageKey);
  } catch {
    // Storage can be unavailable (e.g. private mode).
  }
}

export function saveHomeViewState(partial: Partial<HomeViewState>) {
  try {
    const next: HomeViewState = {
      scrollY: 0,
      showAll: false,
      filter: "all",
      ...getHomeViewState(),
      ...partial,
    };
    sessionStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    // Storage can be unavailable (e.g. private mode); restoring is best-effort.
  }
}
