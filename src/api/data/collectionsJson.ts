import { promises as fs } from "node:fs";

import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const collectionsJsonDirectory = getContentPath("data", "collections");

const TitleSchema = z.object({
  imdbId: z.string(),
  title: z.string(),
  year: z.string(),
  slug: z.nullable(z.string()),
  grade: z.nullable(z.string()),
  sortTitle: z.string(),
  gradeValue: z.nullable(z.number()),
  releaseSequence: z.string(),
});

const CollectionJsonSchema = z.object({
  name: z.string(),
  slug: z.string(),
  reviewCount: z.number(),
  titleCount: z.number(),
  description: z.string(),
  titles: z.array(TitleSchema),
});

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

export type CollectionJson = z.infer<typeof CollectionJsonSchema>;

export async function allCollectionsJson(): Promise<CollectionJson[]> {
  return await parseAllCollectionsJson();
}
