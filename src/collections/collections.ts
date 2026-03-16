import type { LoaderContext } from "astro/loaders";

import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import path from "node:path";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkRehype from "remark-rehype";
import strip from "strip-markdown";

import { CONTENT_ROOT } from "./contentRoot";
import { getBaseMarkdownProcessor } from "./utils/getBaseMarkdownProcessor";
import { loadJsonDirectory } from "./utils/loadJsonDirectory";
import { emToQuotes } from "./utils/markdown-plugins/emToQuotes";
import { rootAsSpan } from "./utils/markdown-plugins/rootAsSpan";

function descriptionToHtml(description: string) {
  return getBaseMarkdownProcessor()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rootAsSpan)
    .use(rehypeStringify)
    .processSync(description)
    .toString();
}

function descriptionToString(description: string) {
  return getBaseMarkdownProcessor()
    .use(emToQuotes)
    .use(strip)
    .processSync(description)
    .toString();
}

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
  titles: z.array(CollectionTitleSchema),
});

const RawCollectionSchema = z.object({
  description: z.string(),
  name: z.string(),
  reviewCount: z.number(),
  slug: z.string(),
  titles: z.array(CollectionTitleSchema),
});

export const collections = defineCollection({
  loader: {
    load: (loaderContext: LoaderContext) =>
      loadJsonDirectory({
        buildData: ({ raw }) => {
          const rawCollection = RawCollectionSchema.parse(raw);

          return {
            description: descriptionToString(rawCollection.description),
            descriptionHtml: descriptionToHtml(rawCollection.description),
            name: rawCollection.name,
            reviewCount: rawCollection.reviewCount,
            slug: rawCollection.slug,
            titles: rawCollection.titles,
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
