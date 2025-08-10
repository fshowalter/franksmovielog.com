import { promises as fs } from "node:fs";
import { z } from "zod";

import { ContentCache, generateSchemaHash } from "./utils/cache";
import { getContentPath } from "./utils/getContentPath";
import { nullableNumber, nullableString } from "./utils/nullable";

const viewingsJsonFile = getContentPath("data", "viewings.json");

const ViewingJsonSchema = z
  .object({
    genres: z.array(z.string()),
    grade: nullableString(),
    gradeValue: nullableNumber(),
    imdbId: z.string(),
    medium: nullableString(),
    releaseSequence: z.string(),
    releaseYear: z.string(),
    reviewDate: nullableString(),
    reviewSequence: nullableString(),
    slug: nullableString(),
    sortTitle: z.string(),
    title: z.string(),
    venue: nullableString(),
    viewingDate: z.string(),
    viewingSequence: z.number(),
  })
  .transform((data) => {
    // fix zod making anything with undefined optional
    return {
      genres: data.genres,
      grade: data.grade,
      gradeValue: data.gradeValue,
      imdbId: data.imdbId,
      medium: data.medium,
      releaseSequence: data.releaseSequence,
      releaseYear: data.releaseYear,
      reviewDate: data.reviewDate,
      reviewSequence: data.reviewSequence,
      slug: data.slug,
      sortTitle: data.sortTitle,
      title: data.title,
      venue: data.venue,
      viewingDate: data.viewingDate,
      viewingSequence: data.viewingSequence,
    };
  });

export type ViewingJson = z.infer<typeof ViewingJsonSchema>;

// Create cache instance with schema hash
let cacheInstance: ContentCache<ViewingJson[]> | undefined;

export async function allViewingsJson(): Promise<ViewingJson[]> {
  const cache = await getCache();
  const fileContents = await fs.readFile(viewingsJsonFile, "utf8");

  return cache.get(viewingsJsonFile, fileContents, (content) => {
    const data = JSON.parse(content) as unknown[];
    return data.map((item) => ViewingJsonSchema.parse(item));
  });
}

async function getCache(): Promise<ContentCache<ViewingJson[]>> {
  if (!cacheInstance) {
    const schemaHash = await generateSchemaHash(
      JSON.stringify(ViewingJsonSchema._def.schema.shape),
    );
    cacheInstance = new ContentCache<ViewingJson[]>(
      "viewings-json",
      schemaHash,
    );
  }
  return cacheInstance;
}
