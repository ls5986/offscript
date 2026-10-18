import type {
  PromptNavigation,
  PromptSnapshot,
  StudioState,
} from "./contracts";

export function currentPromptNavigation(
  snapshot: PromptSnapshot,
  navigation: PromptNavigation | undefined,
  context: string,
): PromptNavigation {
  return navigation?.context === context &&
    JSON.stringify(navigation.snapshots[navigation.index]) ===
      JSON.stringify(snapshot)
    ? navigation
    : { context, snapshots: [structuredClone(snapshot)], index: 0 };
}

export function appendPromptNavigation(
  snapshot: PromptSnapshot | null,
  navigation: PromptNavigation | undefined,
  context: string,
  next: PromptSnapshot,
): PromptNavigation {
  const current = snapshot
    ? currentPromptNavigation(snapshot, navigation, context)
    : undefined;
  if (current && JSON.stringify(snapshot) === JSON.stringify(next))
    return current;
  const snapshots = [
    ...(current?.snapshots.slice(0, current.index + 1) ?? []),
    structuredClone(next),
  ].slice(-30);
  return { context, snapshots, index: snapshots.length - 1 };
}

export function stepPromptNavigation(
  navigation: PromptNavigation,
  direction: -1 | 1,
): PromptNavigation {
  const index = navigation.index + direction;
  if (index < 0 || index >= navigation.snapshots.length)
    throw Error(
      direction === -1
        ? "There is no previous prompt in this history."
        : "There is no next saved prompt.",
    );
  return { ...navigation, index };
}

export function studioPromptContext(
  studio: StudioState,
  classroom: boolean,
): string {
  return JSON.stringify({
    categories: [...studio.categories].sort(),
    count: studio.playerCount,
    flavor: studio.flavor,
    selection: studio.generationStyle,
    compose: studio.composeResult ?? studio.result?.compositionEnabled ?? true,
    classroom,
    contentLevel: classroom ? "clean" : (studio.contentLevel ?? "clean"),
    locks: Object.entries(studio.result?.entries ?? {})
      .filter(([, entry]) => entry.locked)
      .sort(([a], [b]) => a.localeCompare(b)),
  });
}

export function swipeDirection(
  dx: number,
  dy: number,
  touches = 1,
): -1 | 1 | null {
  if (touches !== 1 || Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy) * 2)
    return null;
  return dx < 0 ? 1 : -1;
}
