import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadJsonFileAsSingleEntry } from "./utils/loadJsonFileAsSingleEntry";

const UnderratedSchema = z.object({
  titles: z.array(reference("reviewedTitles")),
});

export const underrated = defineCollection({
  loader: {
    load: (loaderContext) =>
      loadJsonFileAsSingleEntry({
        filePath: path.join(CONTENT_ROOT, "data", "underrated.json"),
        id: "underrated",
        loaderContext,
      }),
    name: "underrated-loader",
  },
  schema: UnderratedSchema,
});
