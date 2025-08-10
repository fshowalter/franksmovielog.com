import { promises as fs } from "node:fs";
import { z } from "zod";

import { ContentCache, generateSchemaHash } from "./utils/cache";
import { getContentPath } from "./utils/getContentPath";
import { nullableNumber, nullableString } from "./utils/nullable";

const collectionsJsonDirectory = getContentPath("data", "collections");

const TitleSchema = z
  .object({
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
  })
  .transform((data) => {
    // fix zod making anything with undefined optional
    return {
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

export type CollectionJson = z.infer<typeof CollectionJsonSchema>;

// Create cache instance with schema hash
let cacheInstance: ContentCache<CollectionJson[]> | undefined;

export async function allCollectionsJson(): Promise<CollectionJson[]> {
  const cache = await getCache();
  const dirents = await fs.readdir(collectionsJsonDirectory, {
    withFileTypes: true,
  });

  const jsonFiles = dirents.filter((item) => !item.isDirectory() && item.name.endsWith(".json"));
  const allFileContents = await Promise.all(
    jsonFiles.map(async (item) => {
      const filePath = `${collectionsJsonDirectory}/${item.name}`;
      const content = await fs.readFile(filePath, "utf8");
      return { content, filePath };
    }),
  );

  // Create a combined cache key from all file contents
  const combinedContent = allFileContents
    .map(({ content, filePath }) => `${filePath}:${content}`)
    .join("\n---\n");

  return cache.get(collectionsJsonDirectory, combinedContent, () => {
    return allFileContents.map(({ content }) => {
      const json = JSON.parse(content) as unknown;
      return CollectionJsonSchema.parse(json);
    });
  });
}

async function getCache(): Promise<ContentCache<CollectionJson[]>> {
  if (!cacheInstance) {
    const schemaHash = await generateSchemaHash(JSON.stringify(CollectionJsonSchema._def.schema.shape));
    cacheInstance = new ContentCache<CollectionJson[]>("collections-json", schemaHash);
  }
  return cacheInstance;
}
