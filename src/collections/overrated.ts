import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadJsonFileAsSingleEntry } from "./utils/loadJsonFileAsSingleEntry";

const OverratedSchema = z.object({
  titles: z.array(reference("reviewedTitles")),
});

export const overrated = defineCollection({
  loader: {
    load: (loaderContext) =>
      loadJsonFileAsSingleEntry({
        filePath: path.join(CONTENT_ROOT, "data", "overrated.json"),
        id: "overrated",
        loaderContext,
      }),
    name: "overrated-loader",
  },
  schema: OverratedSchema,
});
