import { z } from "zod";

import { nullableString } from "./utils/nullable";

export const MostWatchedTitleSchema = z
  .object({
    count: z.number(),
    imdbId: z.string(),
    slug: nullableString(),
    title: z.string(),
    year: z.string(),
  })
  .transform(({ count, imdbId, slug, title, year }) => {
    // fix zod making anything with undefined optional
    return { count, imdbId, slug, title, year };
  });
