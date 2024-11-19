import type { UnderseenJson } from "./data/underseenJson";

import { allUnderseenJson } from "./data/underseenJson";

type UnderseenGem = {} & UnderseenJson;

type UnderseenGems = {
  distinctGenres: string[];
  distinctReleaseYears: string[];
  underseenGems: UnderseenGem[];
};

export async function allUnderseenGems(): Promise<UnderseenGems> {
  const underseenGemsJson = await allUnderseenJson();
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
