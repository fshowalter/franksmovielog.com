import {
  allCastAndCrewJson,
  type CastAndCrewMemberJson,
} from "./data/castAndCrewJson";

export type CastAndCrewMember = CastAndCrewMemberJson & {};

export async function allCastAndCrew(): Promise<{
  castAndCrew: CastAndCrewMember[];
  distinctReleaseYears: string[];
}> {
  const castAndCrewJson = await allCastAndCrewJson();
  const releaseYears = new Set<string>();

  for (const member of castAndCrewJson) {
    for (const title of member.titles) {
      releaseYears.add(title.year);
    }
  }

  return {
    castAndCrew: castAndCrewJson,
    distinctReleaseYears: [...releaseYears].toSorted(),
  };
}

export async function castAndCrewMember(slug: string): Promise<{
  distinctReleaseYears: string[];
  member: CastAndCrewMember;
}> {
  const castAndCrewJson = await allCastAndCrewJson();
  const member = castAndCrewJson.find((value) => value.slug === slug)!;

  const releaseYears = new Set<string>();

  for (const title of member.titles) {
    releaseYears.add(title.year);
  }

  return {
    distinctReleaseYears: [...releaseYears].toSorted(),
    member,
  };
}
