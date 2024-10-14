import type { UnderseenGemsJson } from "./data/underseenGemsJson";

import { allUnderseenGemsJson } from "./data/underseenGemsJson";

type UnderseenGem = {} & UnderseenGemsJson;

type UnderseenGems = {
  distinctGenres: string[];
  distinctReleaseYears: string[];
  underseenGems: UnderseenGem[];
};

export async function allUnderseenGems(): Promise<UnderseenGems> {
  const underseenGemsJson = await allUnderseenGemsJson();
  const distinctReleaseYears = new Set<string>();
  const distinctGenres = new Set<string>();

  const underseenGems = underseenGemsJson.map((title) => {
    for (const genre of title.genres) distinctGenres.add(genre);
    distinctReleaseYears.add(title.year);

    return {
      ...title,
    };
  });

  return {
    distinctGenres: [...distinctGenres].toSorted(),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    underseenGems: underseenGems,
  };
}
