import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const watchlistTitlesJsonFile = getContentPath("data", "watchlist-titles.json");

const WatchlistTitleJsonSchema = z.object({
  collectionNames: z.array(z.string()),
  directorNames: z.array(z.string()),
  imdbId: z.string(),
  performerNames: z.array(z.string()),
  releaseSequence: z.string(),
  sortTitle: z.string(),
  title: z.string(),
  viewed: z.boolean(),
  writerNames: z.array(z.string()),
  year: z.string(),
});

export type WatchlistTitleJson = z.infer<typeof WatchlistTitleJsonSchema>;

export async function allWatchlistTitlesJson(): Promise<WatchlistTitleJson[]> {
  const json = await fs.readFile(watchlistTitlesJsonFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return data.map((title) => {
    return WatchlistTitleJsonSchema.parse(title);
  });
}
