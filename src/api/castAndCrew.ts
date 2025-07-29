import {
  allCastAndCrewJson,
  type CastAndCrewMemberJson,
} from "./data/castAndCrewJson";

export type CastAndCrewMember = CastAndCrewMemberJson & {};

export async function allCastAndCrew(): Promise<{
  castAndCrew: CastAndCrewMember[];
}> {
  const castAndCrewJson = await allCastAndCrewJson();

  return {
    castAndCrew: castAndCrewJson,
  };
}

export async function castAndCrewMember(slug: string): Promise<{
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  member: CastAndCrewMember;
}> {
  const castAndCrewJson = await allCastAndCrewJson();
  const member = castAndCrewJson.find((value) => value.slug === slug)!;

  const releaseYears = new Set<string>();
  const distinctReviewYears = new Set<string>();

  for (const title of member.titles) {
    releaseYears.add(title.year);

    if (title.reviewDate) {
      distinctReviewYears.add(
        new Date(title.reviewDate).toLocaleDateString("en-US", {
          timeZone: "UTC",
          year: "numeric",
        }),
      );
    }
  }

  return {
    distinctReleaseYears: [...releaseYears].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    member,
  };
}
