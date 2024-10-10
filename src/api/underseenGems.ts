import type { UnderseenGemsJson } from "./data/underseenGemsJson";

import { allUnderseenGemsJson } from "./data/underseenGemsJson";

export interface UnderseenGem extends UnderseenGemsJson {}

interface UnderseenGems {
  distinctGenres: string[];
  distinctReleaseYears: string[];
  underseenGems: UnderseenGem[];
}

export async function allUnderseenGems(): Promise<UnderseenGems> {
  const underseenGemsJson = await allUnderseenGemsJson();
  const distinctReleaseYears = new Set<string>();
  const distinctGenres = new Set<string>();

  const underseenGems = underseenGemsJson.map((title) => {
    title.genres.forEach((genre) => distinctGenres.add(genre));
    distinctReleaseYears.add(title.year);

    return {
      ...title,
    };
  });

  return {
    distinctGenres: Array.from(distinctGenres).toSorted(),
    distinctReleaseYears: Array.from(distinctReleaseYears).toSorted(),
    underseenGems: underseenGems,
  };
}
