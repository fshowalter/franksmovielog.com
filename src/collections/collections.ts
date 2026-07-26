import type { LoaderContext } from "astro/loaders";

import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { renderInlineHtml, renderPlainText } from "markdown-utils";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadJsonDirectory } from "./utils/loadJsonDirectory";

const CollectionTitleSchema = z
  .object({
    genres: z.array(z.string()),
    imdbId: z.string(),
    releaseDate: z.string(),
    releaseYear: z.string(),
    reviewSlug: z.nullable(z.string()).transform((data) => data ?? undefined),
    sortTitle: z.string(),
    title: z.string(),
  })
  .transform(
    ({
      genres,
      imdbId,
      releaseDate,
      releaseYear,
      reviewSlug,
      sortTitle,
      title,
    }) => {
      // fix zod making anything with undefined optional
      return {
        genres,
        imdbId,
        releaseDate,
        releaseYear,
        reviewSlug,
        sortTitle,
        title,
      };
    },
  );

const CollectionSchema = z.object({
  description: z.string(),
  descriptionHtml: z.string(),
  name: z.string(),
  reviewCount: z.number(),
  slug: z.string(),
  sortName: z.string(),
  titles: z.array(CollectionTitleSchema),
});

const RawCollectionSchema = z.object({
  description: z.string(),
});

export const collections = defineCollection({
  loader: {
    load: (loaderContext: LoaderContext) =>
      loadJsonDirectory({
        buildData: ({ raw }) => {
          const rawCollection = RawCollectionSchema.parse(raw);
          return {
            description: renderPlainText(rawCollection.description, {
              quoteUnderscoreEmphasis: true,
            }),
            descriptionHtml: renderInlineHtml(rawCollection.description),
            name: raw.name,
            reviewCount: raw.reviewCount,
            slug: raw.slug,
            sortName: raw.sortName,
            titles: raw.titles,
          };
        },
        directoryPath: path.join(CONTENT_ROOT, "data", "collections"),
        getId: (raw) => raw.slug as string,
        loaderContext,
      }),
    name: "collections-loader",
  },
  schema: CollectionSchema,
});
