import { promises as fs } from "node:fs";
import { z } from "zod";

import { ContentCache, generateSchemaHash } from "./utils/cache";
import { getContentPath } from "./utils/getContentPath";

const overratedJsonFile = getContentPath("data", "overrated.json");

const OverratedJsonSchema = z
  .object({
    genres: z.array(z.string()),
    grade: z.string(),
    gradeValue: z.number(),
    imdbId: z.string(),
    releaseSequence: z.string(),
    releaseYear: z.string(),
    reviewDate: z.date({ coerce: true }),
    reviewSequence: z.string(),
    slug: z.string(),
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

export type OverratedJson = z.infer<typeof OverratedJsonSchema>;

// Create cache instance with schema hash
let cacheInstance: ContentCache<OverratedJson[]> | undefined;

export async function allOverratedJson(): Promise<OverratedJson[]> {
  const cache = await getCache();
  const fileContents = await fs.readFile(overratedJsonFile, "utf8");
  
  return cache.get(overratedJsonFile, fileContents, (content) => {
    const data = JSON.parse(content) as unknown[];
    return data.map((item) => OverratedJsonSchema.parse(item));
  });
}

async function getCache(): Promise<ContentCache<OverratedJson[]>> {
  if (!cacheInstance) {
    const schemaHash = await generateSchemaHash(JSON.stringify(OverratedJsonSchema._def.schema.shape));
    cacheInstance = new ContentCache<OverratedJson[]>("overrated-json", schemaHash);
  }
  return cacheInstance;
}
