// The landing reads like a season: each section is an episode with a code
// (E01…E07), and the floating "Next episode" button always points at the next.

export const EPISODES = [
  { id: "top", key: "hero" },
  { id: "value", key: "value" },
  { id: "features", key: "features" },
  { id: "product", key: "product" },
  { id: "pricing", key: "conversion" },
  { id: "faq", key: "faq" },
  { id: "launch", key: "finalCta" },
] as const;

export type EpisodeKey = (typeof EPISODES)[number]["key"];

export function episodeCode(key: EpisodeKey): string {
  const index = EPISODES.findIndex((episode) => episode.key === key);
  return `E${String(index + 1).padStart(2, "0")}`;
}
