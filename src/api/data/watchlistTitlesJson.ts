import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const watchlistTitlesJsonFile = getContentPath("data", "watchlist-titles.json");

const WatchlistTitleJsonSchema = z
  .object({
    collectionNames: z.array(z.string()).optional(),
    directorNames: z.array(z.string()).optional(),
    genres: z.array(z.string()).optional(),
    imdbId: z.string(),
    performerNames: z.array(z.string()).optional(),
    releaseSequence: z.string(),
    releaseYear: z.string().optional(),
    sortTitle: z.string(),
    title: z.string(),
    viewed: z.boolean(),
    watchlistCollectionNames: z.array(z.string()).optional(),
    watchlistDirectorNames: z.array(z.string()).optional(),
    watchlistPerformerNames: z.array(z.string()).optional(),
    watchlistWriterNames: z.array(z.string()).optional(),
    writerNames: z.array(z.string()).optional(),
    year: z.string().optional(),
  })
  .transform((data) => {
    // Handle both old and new field names
    const releaseYear = data.releaseYear || data.year || "";
    const genres = data.genres || [];
    const watchlistDirectorNames =
      data.watchlistDirectorNames || data.directorNames || [];
    const watchlistPerformerNames =
      data.watchlistPerformerNames || data.performerNames || [];
    const watchlistWriterNames =
      data.watchlistWriterNames || data.writerNames || [];
    const watchlistCollectionNames =
      data.watchlistCollectionNames || data.collectionNames || [];

    // fix zod making anything with undefined optional
    return {
      genres,
      imdbId: data.imdbId,
      releaseSequence: data.releaseSequence,
      releaseYear,
      sortTitle: data.sortTitle,
      title: data.title,
      viewed: data.viewed,
      watchlistCollectionNames,
      watchlistDirectorNames,
      watchlistPerformerNames,
      watchlistWriterNames,
    };
  });

export type WatchlistTitleJson = z.infer<typeof WatchlistTitleJsonSchema>;

export async function allWatchlistTitlesJson(): Promise<WatchlistTitleJson[]> {
  const json = await fs.readFile(watchlistTitlesJsonFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return data.map((title) => {
    return WatchlistTitleJsonSchema.parse(title);
  });
}
