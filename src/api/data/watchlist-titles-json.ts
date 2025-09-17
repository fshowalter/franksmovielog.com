import { promises as fs } from "node:fs";
import { z } from "zod";

import { perfLogger } from "~/utils/performanceLogger";

import { getContentPath } from "./utils/getContentPath";

const watchlistTitlesJsonFile = getContentPath("data", "watchlist-titles.json");

const WatchlistTitleJsonSchema = z
  .object({
    genres: z.array(z.string()),
    imdbId: z.string(),
    releaseSequence: z.number(),
    releaseYear: z.string(),
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
      genres: data.genres,
      imdbId: data.imdbId,
      releaseSequence: data.releaseSequence,
      releaseYear: data.releaseYear,
      sortTitle: data.sortTitle,
      title: data.title,
      watchlistCollectionNames: data.watchlistCollectionNames,
      watchlistDirectorNames: data.watchlistDirectorNames,
      watchlistPerformerNames: data.watchlistPerformerNames,
      watchlistWriterNames: data.watchlistWriterNames,
    };
  });

export type WatchlistTitleJson = z.infer<typeof WatchlistTitleJsonSchema>;

export async function allWatchlistTitlesJson(): Promise<WatchlistTitleJson[]> {
  return await perfLogger.measure("allWatchlistTitlesJson", async () => {
    const json = await fs.readFile(watchlistTitlesJsonFile, "utf8");
    const data = JSON.parse(json) as unknown[];

    return data.map((title) => {
      return WatchlistTitleJsonSchema.parse(title);
    });
  });
}
