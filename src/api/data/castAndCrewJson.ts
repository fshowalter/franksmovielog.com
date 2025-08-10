import { promises as fs } from "node:fs";
import { z } from "zod";

import { ContentCache, generateSchemaHash } from "./utils/cache";
import { getContentPath } from "./utils/getContentPath";
import { nullableNumber, nullableString } from "./utils/nullable";

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

// Create cache instance with schema hash
let cacheInstance: ContentCache<CastAndCrewMemberJson[]> | undefined;

export async function allCastAndCrewJson(): Promise<CastAndCrewMemberJson[]> {
  const cache = await getCache();
  const dirents = await fs.readdir(castAndCrewJsonDirectory, {
    withFileTypes: true,
  });

  const jsonFiles = dirents.filter(
    (item) => !item.isDirectory() && item.name.endsWith(".json"),
  );
  const allFileContents = await Promise.all(
    jsonFiles.map(async (item) => {
      const filePath = `${castAndCrewJsonDirectory}/${item.name}`;
      const content = await fs.readFile(filePath, "utf8");
      return { content, filePath };
    }),
  );

  // Create a combined cache key from all file contents
  const combinedContent = allFileContents
    .map(({ content, filePath }) => `${filePath}:${content}`)
    .join("\n---\n");

  return cache.get(castAndCrewJsonDirectory, combinedContent, () => {
    return allFileContents.map(({ content }) => {
      const json = JSON.parse(content) as unknown;
      return CastAndCrewJsonSchema.parse(json);
    });
  });
}

async function getCache(): Promise<ContentCache<CastAndCrewMemberJson[]>> {
  if (!cacheInstance) {
    const schemaHash = await generateSchemaHash(
      JSON.stringify(CastAndCrewJsonSchema._def.schema.shape),
    );
    cacheInstance = new ContentCache<CastAndCrewMemberJson[]>(
      "cast-and-crew-json",
      schemaHash,
    );
  }
  return cacheInstance;
}
