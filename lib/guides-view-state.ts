const scrollPositionKey = "guides-list-scroll-position";
const restorePendingKey = "guides-list-restore-pending";

export function saveGuidesListScrollPosition(scrollY: number) {
  try {
    sessionStorage.setItem(scrollPositionKey, String(scrollY));
  } catch {
    // Scroll restoration is best-effort when session storage is unavailable.
  }
}

export function requestGuidesListScrollRestore() {
  try {
    sessionStorage.setItem(restorePendingKey, "true");
  } catch {
    // Scroll restoration is best-effort when session storage is unavailable.
  }
}

export function clearGuidesListScrollRestore() {
  try {
    sessionStorage.removeItem(restorePendingKey);
  } catch {
    // Scroll restoration is best-effort when session storage is unavailable.
  }
}

export function consumeGuidesListScrollRestore() {
  try {
    if (sessionStorage.getItem(restorePendingKey) !== "true") return null;

    sessionStorage.removeItem(restorePendingKey);
    const scrollY = Number(sessionStorage.getItem(scrollPositionKey));
    return Number.isFinite(scrollY) && scrollY >= 0 ? scrollY : null;
  } catch {
    return null;
  }
}
