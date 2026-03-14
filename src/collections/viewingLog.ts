import type { LoaderContext } from "astro/loaders";

import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadJsonSplitFile } from "./utils/loadJsonSplitFile";

const ViewingLogSchema = z
  .object({
    medium: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    releaseYear: z.string(),
    reviewSlug: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    sortTitle: z.string(),
    title: z.string(),
    venue: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    viewingDate: z.coerce.date(),
  })
  .transform(
    ({
      medium,
      releaseYear,
      reviewSlug,
      sortTitle,
      title,
      venue,
      viewingDate,
    }) => {
      // fix zod making anything with undefined optional
      return {
        medium,
        releaseYear,
        reviewSlug,
        sortTitle,
        title,
        venue,
        viewingDate,
      };
    },
  );

export const viewingLog = defineCollection({
  loader: {
    load: (loaderContext: LoaderContext) =>
      loadJsonSplitFile({
        directoryPath: path.join(CONTENT_ROOT, "data", "viewing-log"),
        loaderContext,
      }),
    name: "viewing-log-loader",
  },
  schema: ViewingLogSchema,
});
