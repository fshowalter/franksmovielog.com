import { promises as fs } from "node:fs";
import { z } from "zod";

import { ContentCache, generateSchemaHash } from "./utils/cache";
import { getContentPath } from "./utils/getContentPath";
import { nullableString } from "./utils/nullable";

const watchlistProgressJsonFile = getContentPath(
  "data",
  "watchlist-progress.json",
);

const Detail = z
  .object({
    name: z.string(),
    reviewCount: z.number(),
    slug: nullableString(),
    titleCount: z.number(),
  })
  .transform(({ name, reviewCount, slug, titleCount }) => {
    // fix zod making anything with undefined optional
    return { name, reviewCount, slug, titleCount };
  });

const WatchlistProgressJsonSchema = z.object({
  collectionDetails: z.array(Detail),
  collectionReviewed: z.number(),
  collectionTotal: z.number(),
  directorDetails: z.array(Detail),
  directorReviewed: z.number(),
  directorTotal: z.number(),
  performerDetails: z.array(Detail),
  performerReviewed: z.number(),
  performerTotal: z.number(),
  reviewed: z.number(),
  total: z.number(),
  writerDetails: z.array(Detail),
  writerReviewed: z.number(),
  writerTotal: z.number(),
});

export type WatchlistProgressJson = z.infer<typeof WatchlistProgressJsonSchema>;

// Create cache instance with schema hash
let cacheInstance: ContentCache<WatchlistProgressJson> | undefined;

export async function watchlistProgressJson(): Promise<WatchlistProgressJson> {
  const cache = await getCache();
  const fileContents = await fs.readFile(watchlistProgressJsonFile, "utf8");
  
  return cache.get(watchlistProgressJsonFile, fileContents, (content) => {
    const data = JSON.parse(content) as unknown;
    return WatchlistProgressJsonSchema.parse(data);
  });
}

async function getCache(): Promise<ContentCache<WatchlistProgressJson>> {
  if (!cacheInstance) {
    const schemaHash = await generateSchemaHash(JSON.stringify(WatchlistProgressJsonSchema.shape));
    cacheInstance = new ContentCache<WatchlistProgressJson>("watchlist-progress-json", schemaHash);
  }
  return cacheInstance;
}
