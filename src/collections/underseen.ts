import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadJsonFileAsSingleEntry } from "./utils/loadJsonFileAsSingleEntry";

const UnderseenSchema = z.object({
  titles: z.array(reference("reviewedTitles")),
});

export const underseen = defineCollection({
  loader: {
    load: (loaderContext) =>
      loadJsonFileAsSingleEntry({
        filePath: path.join(CONTENT_ROOT, "data", "underseen.json"),
        id: "underseen",
        loaderContext,
      }),
    name: "underseen-loader",
  },
  schema: UnderseenSchema,
});
