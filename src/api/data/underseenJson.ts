import { promises as fs } from "node:fs";
import { z } from "zod";

import { ContentCache, generateSchemaHash } from "./utils/cache";
import { getContentPath } from "./utils/getContentPath";

const underseenJsonFile = getContentPath("data", "underseen.json");

const UnderseenJsonSchema = z
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

export type UnderseenJson = z.infer<typeof UnderseenJsonSchema>;

// Create cache instance with schema hash
let cacheInstance: ContentCache<UnderseenJson[]> | undefined;

export async function allUnderseenJson(): Promise<UnderseenJson[]> {
  const cache = await getCache();
  const fileContents = await fs.readFile(underseenJsonFile, "utf8");
  
  return cache.get(underseenJsonFile, fileContents, (content) => {
    const data = JSON.parse(content) as unknown[];
    return data.map((item) => UnderseenJsonSchema.parse(item));
  });
}

async function getCache(): Promise<ContentCache<UnderseenJson[]>> {
  if (!cacheInstance) {
    const schemaHash = await generateSchemaHash(JSON.stringify(UnderseenJsonSchema._def.schema.shape));
    cacheInstance = new ContentCache<UnderseenJson[]>("underseen-json", schemaHash);
  }
  return cacheInstance;
}
