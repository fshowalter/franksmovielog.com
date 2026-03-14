import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadSingleJsonFile } from "./utils/loadSingleJsonFile";

const WatchlistProgressDetailSchema = z
  .object({
    name: z.string(),
    reviewCount: z.number(),
    slug: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    titleCount: z.number(),
  })
  .transform(({ name, reviewCount, slug, titleCount }) => {
    // fix zod making anything with undefined optional
    return { name, reviewCount, slug, titleCount };
  });

export type WatchlistProgressDetail = z.infer<
  typeof WatchlistProgressDetailSchema
>;

const WatchlistProgressSchema = z.object({
  collectionDetails: z.array(WatchlistProgressDetailSchema),
  collectionReviewed: z.number(),
  collectionTotal: z.number(),
  directorDetails: z.array(WatchlistProgressDetailSchema),
  directorReviewed: z.number(),
  directorTotal: z.number(),
  performerDetails: z.array(WatchlistProgressDetailSchema),
  performerReviewed: z.number(),
  performerTotal: z.number(),
  reviewed: z.number(),
  total: z.number(),
  writerDetails: z.array(WatchlistProgressDetailSchema),
  writerReviewed: z.number(),
  writerTotal: z.number(),
});

export const watchlistProgress = defineCollection({
  loader: {
    load: (loaderContext) =>
      loadSingleJsonFile({
        filePath: path.join(CONTENT_ROOT, "data", "watchlist-progress.json"),
        id: "watchlistProgress",
        loaderContext,
      }),
    name: "watchlist-progress-loader",
  },
  schema: WatchlistProgressSchema,
});
