import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadJsonFileAsCollection } from "./utils/loadJsonFileAsCollection";

const WatchlistTitleSchema = z
  .object({
    genres: z.array(z.string()),
    imdbId: z.string(),
    releaseDate: z.string(),
    releaseYear: z.string(),
    sortTitle: z.string(),
    title: z.string(),
    watchlistCollectionNames: z.array(z.string()),
    watchlistDirectorNames: z.array(z.string()),
    watchlistPerformerNames: z.array(z.string()),
    watchlistWriterNames: z.array(z.string()),
  })
  .transform(
    ({
      genres,
      imdbId,
      releaseDate,
      releaseYear,
      sortTitle,
      title,
      watchlistCollectionNames,
      watchlistDirectorNames,
      watchlistPerformerNames,
      watchlistWriterNames,
    }) => {
      // fix zod making anything with undefined optional
      return {
        genres,
        imdbId,
        releaseDate,
        releaseYear,
        sortTitle,
        title,
        watchlistCollectionNames,
        watchlistDirectorNames,
        watchlistPerformerNames,
        watchlistWriterNames,
      };
    },
  );

export const watchlistTitles = defineCollection({
  loader: {
    load: (loaderContext) =>
      loadJsonFileAsCollection({
        filePath: path.join(CONTENT_ROOT, "data", "watchlist-titles.json"),
        getId: (raw) => raw.imdbId as string,
        loaderContext,
      }),
    name: "watchlist-titles-loader",
  },
  schema: WatchlistTitleSchema,
});
