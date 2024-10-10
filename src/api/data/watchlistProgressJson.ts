import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const watchlistProgressJsonFile = getContentPath(
  "data",
  "watchlist-progress.json",
);

const Detail = z.object({
  name: z.string(),
  reviewCount: z.number(),
  slug: z.nullable(z.string()),
  titleCount: z.number(),
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

export async function watchlistProgressJson(): Promise<WatchlistProgressJson> {
  const json = await fs.readFile(watchlistProgressJsonFile, "utf8");
  const data = JSON.parse(json) as unknown;

  return WatchlistProgressJsonSchema.parse(data);
}
