import { ENABLE_CACHE } from "~/utils/cache";
import { perfLogger } from "~/utils/performanceLogger";

import type { CastAndCrewMemberJson } from "./data/cast-and-crew-json";

import { allCastAndCrewJson } from "./data/cast-and-crew-json";
import { loadExcerptHtml } from "./reviews";
import { createReleaseSequenceMap } from "./utils/createReleaseSequenceMap";

let cachedCastAndCrewJson: CastAndCrewMemberJson[];

/**
 * Cast or crew member with their titles and metadata.
 */
export type CastAndCrewMember = CastAndCrewMemberJson & {};

/**
 * Retrieves all cast and crew members.
 * @returns Object containing array of all cast and crew members
 */
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

/**
 * Retrieves details for a specific cast or crew member.
 * @param slug - The unique identifier for the cast/crew member
 * @returns Member details with distinct genres, release years, and review years from their titles
 */
export async function castAndCrewMember(slug: string): Promise<{
  distinctGenres: string[];
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  member: Omit<CastAndCrewMember, "titles"> & {
    titles: (CastAndCrewMember["titles"][number] & {
      releaseSequence: number;
    })[];
  };
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

    const releaseSequenceMap = createReleaseSequenceMap(member.titles);

    const titles = await Promise.all(
      member.titles.map(async (title) => {
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

        let excerpt;

        if (title.slug) {
          const titleWithExcerpt = await loadExcerptHtml({ slug: title.slug });
          excerpt = titleWithExcerpt.excerpt;
        }

        return {
          excerpt,
          ...title,
          releaseSequence: releaseSequenceMap.get(title.imdbId)!,
        };
      }),
    );

    return {
      distinctGenres: [...distinctGenres].toSorted(),
      distinctReleaseYears: [...releaseYears].toSorted(),
      distinctReviewYears: [...distinctReviewYears].toSorted(),
      member: {
        ...member,
        titles,
      },
    };
  });
}
