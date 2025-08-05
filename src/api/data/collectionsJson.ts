import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";
import { nullableNumber, nullableString } from "./utils/nullable";

const collectionsJsonDirectory = getContentPath("data", "collections");

const TitleSchema = z
  .object({
    genres: z.array(z.string()).optional(),
    grade: nullableString(),
    gradeValue: nullableNumber(),
    imdbId: z.string(),
    releaseSequence: z.string(),
    releaseYear: z.string().optional(),
    reviewDate: nullableString(),
    reviewSequence: nullableString(),
    slug: nullableString(),
    sortTitle: z.string(),
    title: z.string(),
    year: z.string().optional(),
  })
  .transform((data) => {
    // Handle both old and new field names
    const releaseYear = data.releaseYear || data.year || "";
    const genres = data.genres || [];

    // fix zod making anything with undefined optional
    return {
      genres,
      grade: data.grade,
      gradeValue: data.gradeValue,
      imdbId: data.imdbId,
      releaseSequence: data.releaseSequence,
      releaseYear,
      reviewDate: data.reviewDate,
      reviewSequence: data.reviewSequence,
      slug: data.slug,
      sortTitle: data.sortTitle,
      title: data.title,
    };
  });

const CollectionJsonSchema = z
  .object({
    description: z.string().optional(),
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

export type CollectionJson = z.infer<typeof CollectionJsonSchema>;

export async function allCollectionsJson(): Promise<CollectionJson[]> {
  return await parseAllCollectionsJson();
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
