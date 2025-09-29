import { promises as fs } from "node:fs";
import { z } from "zod";

import { perfLogger } from "~/utils/performanceLogger";

import { getContentPath } from "./utils/getContentPath";
import { nullableNumber, nullableString } from "./utils/nullable";

const collectionsJsonDirectory = getContentPath("data", "collections");

const TitleSchema = z
  .object({
    genres: z.array(z.string()),
    grade: nullableString(),
    gradeValue: nullableNumber(),
    imdbId: z.string(),
    releaseDate: z.string(),
    releaseYear: z.string(),
    reviewDate: nullableString(),
    reviewSequence: nullableNumber(),
    slug: nullableString(),
    sortTitle: z.string(),
    title: z.string(),
  })
  .transform((data) => {
    // fix zod making anything with undefined optional
    return {
      genres: data.genres,
      grade: data.grade,
      gradeValue: data.gradeValue,
      imdbId: data.imdbId,
      releaseDate: data.releaseDate,
      releaseYear: data.releaseYear,
      reviewDate: data.reviewDate,
      reviewSequence: data.reviewSequence,
      slug: data.slug,
      sortTitle: data.sortTitle,
      title: data.title,
    };
  });

const CollectionJsonSchema = z
  .object({
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
      description: data.description,
      name: data.name,
      reviewCount: data.reviewCount,
      slug: data.slug,
      titleCount: data.titleCount,
      titles: data.titles,
    };
  });

/**
 * Type for collection JSON data.
 */
export type CollectionJson = z.infer<typeof CollectionJsonSchema>;

/**
 * Loads and parses all collection data from JSON files.
 * @returns Array of parsed collection data
 */
export async function allCollectionsJson(): Promise<CollectionJson[]> {
  return await perfLogger.measure("allCollectionsJson", async () => {
    return await parseAllCollectionsJson();
  });
}

async function parseAllCollectionsJson() {
  const dirents = await fs.readdir(collectionsJsonDirectory, {
    withFileTypes: true,
  });

  return Promise.all(
    dirents
      .filter((item) => !item.isDirectory() && item.name.endsWith(".json"))
      .map(async (item) => {
        const fileContents = await fs.readFile(
          `${collectionsJsonDirectory}/${item.name}`,
          "utf8",
        );

        const json = JSON.parse(fileContents) as unknown;
        return CollectionJsonSchema.parse(json);
      }),
  );
}
