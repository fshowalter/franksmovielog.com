import { z } from "zod";

import { nullableNumber, nullableString } from "./utils/nullable";

const MostWatchedPersonViewingSchema = z
  .object({
    genres: z.array(z.string()),
    grade: nullableString(),
    gradeValue: nullableNumber(),
    imdbId: z.string(),
    medium: nullableString(),
    releaseSequence: z.string(),
    releaseYear: z.string(),
    reviewDate: nullableString(),
    reviewSequence: nullableString(),
    slug: nullableString(),
    sortTitle: z.string(),
    title: z.string(),
    venue: nullableString(),
    viewingDate: z.string(),
    viewingSequence: z.number(),
  })
  .transform((data) => {
    // fix zod making anything with undefined optional
    return {
      genres: data.genres,
      grade: data.grade,
      gradeValue: data.gradeValue,
      imdbId: data.imdbId,
      medium: data.medium,
      releaseSequence: data.releaseSequence,
      releaseYear: data.releaseYear,
      reviewDate: data.reviewDate,
      reviewSequence: data.reviewSequence,
      slug: data.slug,
      sortTitle: data.sortTitle,
      title: data.title,
      venue: data.venue,
      viewingDate: data.viewingDate,
      viewingSequence: data.viewingSequence,
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
