import { collator } from "~/utils/collator";

import type { UnderratedJson } from "./data/underrated-json";

import { allUnderratedJson } from "./data/underrated-json";

type UnderratedSurprise = UnderratedJson & {};

type UnderratedSurprises = {
  distinctGenres: string[];
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  underratedSurprises: UnderratedSurprise[];
};

/**
 * Retrieves all underrated surprise movies with metadata for filtering.
 * @returns Object containing underrated surprises and distinct values for genres, release years, and review years
 */
export async function allUnderratedSurprises(): Promise<UnderratedSurprises> {
  const underratedJson = await allUnderratedJson();
  const distinctReleaseYears = new Set<string>();
  const distinctGenres = new Set<string>();
  const distinctReviewYears = new Set<string>();

  const underratedSurprises = underratedJson.map((title) => {
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
    };
  });

  return {
    distinctGenres: [...distinctGenres].toSorted((a, b) =>
      collator.compare(a, b),
    ),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    underratedSurprises,
  };
}
