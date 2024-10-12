import { z } from "zod";

import { nullableString } from "./utils/nullable";

const MostWatchedPersonViewingSchema = z
  .object({
    date: z.string(),
    medium: nullableString(),
    sequence: z.number(),
    slug: nullableString(),
    title: z.string(),
    venue: nullableString(),
    year: z.string(),
  })
  .transform(({ date, medium, sequence, slug, title, venue, year }) => {
    // fix zod making anything with undefined optional
    return { date, medium, sequence, slug, title, venue, year };
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
