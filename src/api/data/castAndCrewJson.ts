import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";
import { nullableNumber, nullableString } from "./utils/nullable";
import { perfLogger } from "./utils/performanceLogger";

const castAndCrewJsonDirectory = getContentPath("data", "cast-and-crew");

const TitleSchema = z
  .object({
    creditedAs: z.array(z.string()),
    genres: z.array(z.string()),
    grade: nullableString(),
    gradeValue: nullableNumber(),
    imdbId: z.string(),
    releaseSequence: z.string(),
    releaseYear: z.string(),
    reviewDate: nullableString(),
    reviewSequence: nullableString(),
    slug: nullableString(),
    sortTitle: z.string(),
    title: z.string(),
    watchlistCollectionNames: z.array(z.string()),
    watchlistDirectorNames: z.array(z.string()),
    watchlistPerformerNames: z.array(z.string()),
    watchlistWriterNames: z.array(z.string()),
  })
  .transform((data) => {
    // fix zod making anything with undefined optional
    return {
      creditedAs: data.creditedAs,
      genres: data.genres,
      grade: data.grade,
      gradeValue: data.gradeValue,
      imdbId: data.imdbId,
      releaseSequence: data.releaseSequence,
      releaseYear: data.releaseYear,
      reviewDate: data.reviewDate,
      reviewSequence: data.reviewSequence,
      slug: data.slug,
      sortTitle: data.sortTitle,
      title: data.title,
      watchlistCollectionNames: data.watchlistCollectionNames,
      watchlistDirectorNames: data.watchlistDirectorNames,
      watchlistPerformerNames: data.watchlistPerformerNames,
      watchlistWriterNames: data.watchlistWriterNames,
    };
  });

const CastAndCrewJsonSchema = z
  .object({
    creditedAs: z.array(z.string()),
    description: z.string(),
    name: z.string(),
    reviewCount: z.number(),
    slug: z.string(),
    titleCount: z.number(),
    titles: z.array(TitleSchema),
  })
  .transform((data) => {
    // fix zod making anything with undefined optional
    return {
      creditedAs: data.creditedAs,
      description: data.description,
      name: data.name,
      reviewCount: data.reviewCount,
      slug: data.slug,
      titleCount: data.titleCount,
      titles: data.titles,
    };
  });

export type CastAndCrewMemberJson = z.infer<typeof CastAndCrewJsonSchema>;

export async function allCastAndCrewJson(): Promise<CastAndCrewMemberJson[]> {
  return await perfLogger.measure("allCastAndCrewJson", async () => {
    return await parseAllCastAndCrewJson();
  });
}

async function parseAllCastAndCrewJson() {
  const dirents = await fs.readdir(castAndCrewJsonDirectory, {
    withFileTypes: true,
  });

  return Promise.all(
    dirents
      .filter((item) => !item.isDirectory() && item.name.endsWith(".json"))
      .map(async (item) => {
        const fileContents = await fs.readFile(
          `${castAndCrewJsonDirectory}/${item.name}`,
          "utf8",
        );

        const json = JSON.parse(fileContents) as unknown;
        return CastAndCrewJsonSchema.parse(json);
      }),
  );
}
