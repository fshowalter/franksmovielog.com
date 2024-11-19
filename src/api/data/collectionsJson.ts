import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";
import { nullableNumber, nullableString } from "./utils/nullable";

const collectionsJsonDirectory = getContentPath("data", "collections");

const TitleSchema = z
  .object({
    grade: nullableString(),
    gradeValue: nullableNumber(),
    imdbId: z.string(),
    releaseSequence: z.string(),
    slug: nullableString(),
    sortTitle: z.string(),
    title: z.string(),
    year: z.string(),
  })
  .transform(
    ({
      grade,
      gradeValue,
      imdbId,
      releaseSequence,
      slug,
      sortTitle,
      title,
      year,
    }) => {
      // fix zod making anything with undefined optional
      return {
        grade,
        gradeValue,
        imdbId,
        releaseSequence,
        slug,
        sortTitle,
        title,
        year,
      };
    },
  );

const CollectionJsonSchema = z.object({
  description: z.string(),
  name: z.string(),
  reviewCount: z.number(),
  slug: z.string(),
  titleCount: z.number(),
  titles: z.array(TitleSchema),
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
