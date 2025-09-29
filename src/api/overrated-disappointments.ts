import { collator } from "~/utils/collator";

import type { OverratedJson } from "./data/overrated-json";

import { allOverratedJson } from "./data/overrated-json";
import { createReleaseSequenceMap } from "./utils/createReleaseSequenceMap";

type OverratedDisappointment = OverratedJson & { releaseSequence: number };

type OverratedDisappointments = {
  distinctGenres: string[];
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  overratedDisappointments: OverratedDisappointment[];
};

/**
 * Retrieves all overrated disappointment movies with metadata for filtering.
 * @returns Object containing overrated disappointments and distinct values for genres, release years, and review years
 */
export async function allOverratedDisappointments(): Promise<OverratedDisappointments> {
  const overratedJson = await allOverratedJson();
  const distinctReleaseYears = new Set<string>();
  const distinctGenres = new Set<string>();
  const distinctReviewYears = new Set<string>();

  const releaseSequenceMap = createReleaseSequenceMap(overratedJson);

  const overratedDisappointments = overratedJson.map((title) => {
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
    overratedDisappointments: overratedDisappointments,
  };
}
