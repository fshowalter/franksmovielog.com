import { z } from "zod";

import { nullableString } from "./utils/nullable";

export const MostWatchedTitleSchema = z
  .object({
    count: z.number(),
    imdbId: z.string(),
    releaseYear: z.string(),
    slug: nullableString(),
    title: z.string(),
  })
  .transform((data) => {
    // fix zod making anything with undefined optional
    return {
      count: data.count,
      imdbId: data.imdbId,
      releaseYear: data.releaseYear,
      slug: data.slug,
      title: data.title,
    };
  });
