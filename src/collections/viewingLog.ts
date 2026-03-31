import type { LoaderContext } from "astro/loaders";

import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadJsonSplitFile } from "./utils/loadJsonSplitFile";

const ViewingLogSchema = z
  .object({
    date: z.coerce.date(),
    medium: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    releaseYear: z.string(),
    reviewSlug: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    sequence: z.string(),
    sortTitle: z.string(),
    title: z.string(),
    venue: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
  })
  .refine((val) => !val.medium && !val.venue, { error: "No medium or venue" })
  .transform(
    ({
      date,
      medium,
      releaseYear,
      reviewSlug,
      sequence,
      sortTitle,
      title,
      venue,
    }) => {
      // fix zod making anything with undefined optional
      return {
        date,
        medium,
        releaseYear,
        reviewSlug,
        sequence,
        sortTitle,
        title,
        venue,
      };
    },
  );

export const viewingLog = defineCollection({
  loader: {
    load: (loaderContext: LoaderContext) =>
      loadJsonSplitFile({
        directoryPath: path.join(CONTENT_ROOT, "data", "viewing-log"),
        getId: (raw) => raw.sequence as string,
        loaderContext,
      }),
    name: "viewing-log-loader",
  },
  schema: ViewingLogSchema,
});
