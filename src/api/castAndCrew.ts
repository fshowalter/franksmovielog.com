import {
  allCastAndCrewJson,
  type CastAndCrewMemberJson,
} from "./data/castAndCrewJson";

export interface CastAndCrewMember extends CastAndCrewMemberJson {}

export async function allCastAndCrew(): Promise<{
  castAndCrew: CastAndCrewMember[];
  distinctReleaseYears: string[];
}> {
  const castAndCrewJson = await allCastAndCrewJson();
  const releaseYears = new Set<string>();

  castAndCrewJson.forEach((member) => {
    member.titles.forEach((title) => {
      releaseYears.add(title.year);
    });
  });

  return {
    castAndCrew: castAndCrewJson,
    distinctReleaseYears: Array.from(releaseYears).toSorted(),
  };
}

export async function castAndCrewMember(slug: string): Promise<{
  distinctReleaseYears: string[];
  member: CastAndCrewMember;
}> {
  const castAndCrewJson = await allCastAndCrewJson();
  const member = castAndCrewJson.find((value) => value.slug === slug)!;

  const releaseYears = new Set<string>();

  member.titles.forEach((title) => {
    releaseYears.add(title.year);
  });

  return {
    distinctReleaseYears: Array.from(releaseYears).toSorted(),
    member,
  };
}
