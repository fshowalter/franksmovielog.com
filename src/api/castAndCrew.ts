import {
  allCastAndCrewJson,
  type CastAndCrewMemberJson,
} from "./data/castAndCrewJson";
import { perfLogger } from "./data/utils/performanceLogger";

// Cache at API level - lazy caching for better build performance
let cachedCastAndCrewJson: CastAndCrewMemberJson[];
const ENABLE_CACHE = !import.meta.env.DEV;

export type CastAndCrewMember = CastAndCrewMemberJson & {};

export async function allCastAndCrew(): Promise<{
  castAndCrew: CastAndCrewMember[];
}> {
  return await perfLogger.measure("allCastAndCrew", async () => {
    const castAndCrewJson = cachedCastAndCrewJson || (await allCastAndCrewJson());
    if (ENABLE_CACHE && !cachedCastAndCrewJson) {
      cachedCastAndCrewJson = castAndCrewJson;
    }

    return {
      castAndCrew: castAndCrewJson,
    };
  });
}

export async function castAndCrewMember(slug: string): Promise<{
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  member: CastAndCrewMember;
}> {
  return await perfLogger.measure("castAndCrewMember", async () => {
    const castAndCrewJson = cachedCastAndCrewJson || (await allCastAndCrewJson());
    if (ENABLE_CACHE && !cachedCastAndCrewJson) {
      cachedCastAndCrewJson = castAndCrewJson;
    }
    const member = castAndCrewJson.find((value) => value.slug === slug)!;

  const releaseYears = new Set<string>();
  const distinctReviewYears = new Set<string>();

  for (const title of member.titles) {
    releaseYears.add(title.releaseYear);

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
  });
}
