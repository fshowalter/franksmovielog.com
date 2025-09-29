import { collator } from "~/utils/collator";

import type { UnderseenJson } from "./data/underseen-json";

import { allUnderseenJson } from "./data/underseen-json";
import { createReleaseSequenceMap } from "./utils/createReleaseSequenceMap";

type UnderseenGem = UnderseenJson & { releaseSequence: number };

type UnderseenGems = {
  distinctGenres: string[];
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  underseenGems: UnderseenGem[];
};

/**
 * Retrieves all underseen gem movies with metadata for filtering.
 * @returns Object containing underseen gems and distinct values for genres, release years, and review years
 */
export async function allUnderseenGems(): Promise<UnderseenGems> {
  const underseenGemsJson = await allUnderseenJson();
  const distinctReleaseYears = new Set<string>();
  const distinctGenres = new Set<string>();
  const distinctReviewYears = new Set<string>();

  const releaseSequenceMap = createReleaseSequenceMap(underseenGemsJson);

  const underseenGems = underseenGemsJson.map((title) => {
    for (const genre of title.genres) distinctGenres.add(genre);
    distinctReleaseYears.add(title.releaseYear);
    distinctReviewYears.add(
      title.reviewDate.toLocaleDateString("en-US", {
        timeZone: "UTC",
        year: "numeric",
      }),
    );

    return {
      ...title,
      releaseSequence: releaseSequenceMap.get(title.imdbId)!,
    };
  });

  return {
    distinctGenres: [...distinctGenres].toSorted((a, b) =>
      collator.compare(a, b),
    ),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    underseenGems: underseenGems,
  };
}
