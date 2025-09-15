import { ENABLE_CACHE } from "~/utils/cache";
import { perfLogger } from "~/utils/performanceLogger";

import type { CastAndCrewMemberJson } from "./data/castAndCrewJson";

import { allCastAndCrewJson } from "./data/castAndCrewJson";

// Cache at API level - lazy caching for better build performance
let cachedCastAndCrewJson: CastAndCrewMemberJson[];
// ENABLE_CACHE is now imported from utils/cache

export type CastAndCrewMember = CastAndCrewMemberJson & {};

export async function allCastAndCrew(): Promise<{
  castAndCrew: CastAndCrewMember[];
}> {
  return await perfLogger.measure("allCastAndCrew", async () => {
    const castAndCrewJson =
      cachedCastAndCrewJson || (await allCastAndCrewJson());
    if (ENABLE_CACHE && !cachedCastAndCrewJson) {
      cachedCastAndCrewJson = castAndCrewJson;
    }

    return {
      castAndCrew: castAndCrewJson,
    };
  });
}

export async function castAndCrewMember(slug: string): Promise<{
  distinctGenres: string[];
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  member: CastAndCrewMember;
}> {
  return await perfLogger.measure("castAndCrewMember", async () => {
    const castAndCrewJson =
      cachedCastAndCrewJson || (await allCastAndCrewJson());
    if (ENABLE_CACHE && !cachedCastAndCrewJson) {
      cachedCastAndCrewJson = castAndCrewJson;
    }
    const member = castAndCrewJson.find((value) => value.slug === slug)!;

    const distinctGenres = new Set<string>();
    const releaseYears = new Set<string>();
    const distinctReviewYears = new Set<string>();

    for (const title of member.titles) {
      releaseYears.add(title.releaseYear);
      for (const genre of title.genres) {
        distinctGenres.add(genre);
      }

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
      distinctGenres: [...distinctGenres].toSorted(),
      distinctReleaseYears: [...releaseYears].toSorted(),
      distinctReviewYears: [...distinctReviewYears].toSorted(),
      member,
    };
  });
}
