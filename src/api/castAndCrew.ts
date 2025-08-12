import {
  allCastAndCrewJson,
  type CastAndCrewMemberJson,
} from "./data/castAndCrewJson";
import { perfLogger } from "./data/utils/performanceLogger";

export type CastAndCrewMember = CastAndCrewMemberJson & {};

// Cache at API level - works better with Astro's build process
let cachedCastAndCrewJson: CastAndCrewMemberJson[];
let cachedAllCastAndCrew: { castAndCrew: CastAndCrewMember[] };
const cachedCastAndCrewMember: Record<string, {
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  member: CastAndCrewMember;
}> = {};

// Enable caching during builds but not in dev mode
const ENABLE_CACHE = !import.meta.env.DEV;

export async function allCastAndCrew(): Promise<{
  castAndCrew: CastAndCrewMember[];
}> {
  return await perfLogger.measure("allCastAndCrew", async () => {
    if (cachedAllCastAndCrew) {
      return cachedAllCastAndCrew;
    }

    const castAndCrewJson = cachedCastAndCrewJson || await allCastAndCrewJson();
    if (ENABLE_CACHE) cachedCastAndCrewJson = castAndCrewJson;

    const result = {
      castAndCrew: castAndCrewJson,
    };

    if (ENABLE_CACHE) {
      cachedAllCastAndCrew = result;
    }

    return result;
  });
}

export async function castAndCrewMember(slug: string): Promise<{
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  member: CastAndCrewMember;
}> {
  return await perfLogger.measure(`castAndCrewMember.${slug}`, async () => {
    if (cachedCastAndCrewMember[slug]) {
      return cachedCastAndCrewMember[slug];
    }

  const castAndCrewJson = cachedCastAndCrewJson || await allCastAndCrewJson();
  if (ENABLE_CACHE) cachedCastAndCrewJson = castAndCrewJson;
  
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

  const result = {
    distinctReleaseYears: [...releaseYears].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    member,
  };

  // Cache the result
  if (ENABLE_CACHE) {
    cachedCastAndCrewMember[slug] = result;
  }

  return result;
  });
}
