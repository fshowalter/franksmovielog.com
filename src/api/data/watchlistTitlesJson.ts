import { promises as fs } from "node:fs";
import { z } from "zod";

import { ContentCache, generateSchemaHash } from "./utils/cache";
import { getContentPath } from "./utils/getContentPath";

const watchlistTitlesJsonFile = getContentPath("data", "watchlist-titles.json");

const WatchlistTitleJsonSchema = z
  .object({
    genres: z.array(z.string()),
    imdbId: z.string(),
    releaseSequence: z.string(),
    releaseYear: z.string(),
    sortTitle: z.string(),
    title: z.string(),
    viewed: z.boolean(),
    watchlistCollectionNames: z.array(z.string()),
    watchlistDirectorNames: z.array(z.string()),
    watchlistPerformerNames: z.array(z.string()),
    watchlistWriterNames: z.array(z.string()),
  })
  .transform((data) => {
    // fix zod making anything with undefined optional
    return {
      genres: data.genres,
      imdbId: data.imdbId,
      releaseSequence: data.releaseSequence,
      releaseYear: data.releaseYear,
      sortTitle: data.sortTitle,
      title: data.title,
      viewed: data.viewed,
      watchlistCollectionNames: data.watchlistCollectionNames,
      watchlistDirectorNames: data.watchlistDirectorNames,
      watchlistPerformerNames: data.watchlistPerformerNames,
      watchlistWriterNames: data.watchlistWriterNames,
    };
  });

export type WatchlistTitleJson = z.infer<typeof WatchlistTitleJsonSchema>;

// Create cache instance with schema hash
let cacheInstance: ContentCache<WatchlistTitleJson[]> | undefined;

export async function allWatchlistTitlesJson(): Promise<WatchlistTitleJson[]> {
  const cache = await getCache();
  const fileContents = await fs.readFile(watchlistTitlesJsonFile, "utf8");
  
  return cache.get(watchlistTitlesJsonFile, fileContents, (content) => {
    const data = JSON.parse(content) as unknown[];
    return data.map((title) => WatchlistTitleJsonSchema.parse(title));
  });
}

async function getCache(): Promise<ContentCache<WatchlistTitleJson[]>> {
  if (!cacheInstance) {
    const schemaHash = await generateSchemaHash(JSON.stringify(WatchlistTitleJsonSchema._def.schema.shape));
    cacheInstance = new ContentCache<WatchlistTitleJson[]>("watchlist-titles-json", schemaHash);
  }
  return cacheInstance;
}
