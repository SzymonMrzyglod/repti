export type CollectionReturnState = {
  collectionScrollY: number;
  collectionShowAll: boolean;
};

type StoredCollectionReturnState = CollectionReturnState & {
  locationKey: string;
};

const storageKey = "collection-return-state";

function isCollectionReturnState(
  value: unknown,
): value is CollectionReturnState {
  if (!value || typeof value !== "object") return false;

  const state = value as Partial<CollectionReturnState>;
  return (
    typeof state.collectionScrollY === "number" &&
    Number.isFinite(state.collectionScrollY) &&
    typeof state.collectionShowAll === "boolean"
  );
}

export function saveCollectionReturnState(
  state: CollectionReturnState,
  locationKey: string,
) {
  try {
    const storedState: StoredCollectionReturnState = {
      ...state,
      locationKey,
    };
    sessionStorage.setItem(storageKey, JSON.stringify(storedState));
  } catch (error) {
    console.error("Could not save collection return state.", error);
  }
}

export function getCollectionReturnState(
  locationState: unknown,
  locationKey: string,
): CollectionReturnState | undefined {
  if (isCollectionReturnState(locationState)) return locationState;

  try {
    const stored = sessionStorage.getItem(storageKey);
    if (!stored) return undefined;

    const state: unknown = JSON.parse(stored);
    if (
      !isCollectionReturnState(state) ||
      (state as StoredCollectionReturnState).locationKey !== locationKey
    ) {
      return undefined;
    }

    return state;
  } catch (error) {
    console.error("Could not read collection return state.", error);
    return undefined;
  }
}

export function clearCollectionReturnState() {
  try {
    sessionStorage.removeItem(storageKey);
  } catch (error) {
    console.error("Could not clear collection return state.", error);
  }
}
