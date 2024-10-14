import type { OverratedDisappointmentsJson } from "./data/overratedDisappointmentsJson";

import { allOverratedDisappointmentsJson } from "./data/overratedDisappointmentsJson";

type OverratedDisappointment = {} & OverratedDisappointmentsJson;

type OverratedDisappointments = {
  distinctGenres: string[];
  distinctReleaseYears: string[];
  overratedDisappointments: OverratedDisappointment[];
};

export async function allOverratedDisappointments(): Promise<OverratedDisappointments> {
  const overratedJson = await allOverratedDisappointmentsJson();
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
