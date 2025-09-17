import { collator } from "~/utils/collator";

import type { OverratedJson } from "./data/overrated-json";

import { allOverratedJson } from "./data/overrated-json";

type OverratedDisappointment = OverratedJson & {};

type OverratedDisappointments = {
  distinctGenres: string[];
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  overratedDisappointments: OverratedDisappointment[];
};

export async function allOverratedDisappointments(): Promise<OverratedDisappointments> {
  const overratedJson = await allOverratedJson();
  const distinctReleaseYears = new Set<string>();
  const distinctGenres = new Set<string>();
  const distinctReviewYears = new Set<string>();

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
    };
  });

  return {
    distinctGenres: [...distinctGenres].sort((a, b) => collator.compare(a, b)),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    overratedDisappointments: overratedDisappointments,
  };
}
