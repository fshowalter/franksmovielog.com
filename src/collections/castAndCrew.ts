import type { LoaderContext } from "astro/loaders";

import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadJsonDirectory } from "./utils/loadJsonDirectory";

const CastAndCrewMemberTitleSchema = z
  .object({
    creditedAs: z.array(z.string()),
    genres: z.array(z.string()),
    imdbId: z.string(),
    releaseDate: z.string(),
    releaseYear: z.string(),
    reviewSlug: z.nullable(z.string()).transform((data) => data ?? undefined),
    sortTitle: z.string(),
    title: z.string(),
    watchlistCollectionNames: z.array(z.string()),
    watchlistDirectorNames: z.array(z.string()),
    watchlistPerformerNames: z.array(z.string()),
    watchlistWriterNames: z.array(z.string()),
  })
  .transform(
    ({
      creditedAs,
      genres,
      imdbId,
      releaseDate,
      releaseYear,
      reviewSlug,
      sortTitle,
      title,
      watchlistCollectionNames,
      watchlistDirectorNames,
      watchlistPerformerNames,
      watchlistWriterNames,
    }) => {
      // fix zod making anything with undefined optional
      return {
        creditedAs,
        genres,
        imdbId,
        releaseDate,
        releaseYear,
        reviewSlug,
        sortTitle,
        title,
        watchlistCollectionNames,
        watchlistDirectorNames,
        watchlistPerformerNames,
        watchlistWriterNames,
      };
    },
  );

const CastAndCrewMemberSchema = z.object({
  name: z.string(),
  reviewCount: z.string(),
  slug: z.string(),
  sortName: z.string(),
  titleCount: z.string(),
  titles: z.array(CastAndCrewMemberTitleSchema),
});

export const reviewedAuthors = defineCollection({
  loader: {
    load: (loaderContext: LoaderContext) =>
      loadJsonDirectory({
        directoryPath: path.join(CONTENT_ROOT, "data", "cast-and-crew"),
        getId: (raw) => raw.slug as string,
        loaderContext,
      }),
    name: "cast-and-crew-loader",
  },
  schema: CastAndCrewMemberSchema,
});
