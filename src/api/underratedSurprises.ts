import type { UnderratedJson } from "./data/underratedJson";

import { allUnderratedJson } from "./data/underratedJson";

type UnderratedSurprise = UnderratedJson & {};

type UnderratedSurprises = {
  distinctGenres: string[];
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  underratedSurprises: UnderratedSurprise[];
};

export async function allUnderratedSurprises(): Promise<UnderratedSurprises> {
  const underratedJson = await allUnderratedJson();
  const distinctReleaseYears = new Set<string>();
  const distinctGenres = new Set<string>();
  const distinctReviewYears = new Set<string>();

  const underratedSurprises = underratedJson.map((title) => {
    for (const genre of title.genres) distinctGenres.add(genre);
    distinctReleaseYears.add(title.year);
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
    distinctGenres: [...distinctGenres].toSorted(),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    underratedSurprises,
  };
}
