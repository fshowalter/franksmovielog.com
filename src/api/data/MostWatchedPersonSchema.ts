import { z } from "zod";

import { nullableString } from "./utils/nullable";

const MostWatchedPersonViewingSchema = z
  .object({
    date: z.string(),
    medium: nullableString(),
    slug: nullableString(),
    title: z.string(),
    venue: nullableString(),
    viewingSequence: z.number(),
    year: z.string(),
  })
  .transform(({ date, medium, slug, title, venue, viewingSequence, year }) => {
    // fix zod making anything with undefined optional
    return {
      date,
      medium,
      releaseYear: year,
      slug,
      title,
      venue,
      viewingSequence,
    };
  });

export const MostWatchedPersonSchema = z
  .object({
    count: z.number(),
    name: z.string(),
    slug: nullableString(),
    viewings: z.array(MostWatchedPersonViewingSchema),
  })
  .transform(({ count, name, slug, viewings }) => {
    // fix zod making anything with undefined optional
    return { count, name, slug, viewings };
  });
