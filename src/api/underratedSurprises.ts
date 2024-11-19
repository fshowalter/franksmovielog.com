import type { UnderratedJson } from "./data/underratedJson";

import { allUnderratedJson } from "./data/underratedJson";

type UnderratedSurprise = UnderratedJson & {};

type UnderratedSurprises = {
  distinctGenres: string[];
  distinctReleaseYears: string[];
  overratedDisappointments: UnderratedSurprise[];
};

export async function allUnderratedSurprises(): Promise<UnderratedSurprises> {
  const overratedJson = await allUnderratedJson();
  const distinctReleaseYears = new Set<string>();
  const distinctGenres = new Set<string>();

  const overratedDisappointments = overratedJson.map((title) => {
    for (const genre of title.genres) distinctGenres.add(genre);
    distinctReleaseYears.add(title.year);

    return {
      ...title,
    };
  });

  return {
    distinctGenres: [...distinctGenres].toSorted(),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    overratedDisappointments: overratedDisappointments,
  };
}
