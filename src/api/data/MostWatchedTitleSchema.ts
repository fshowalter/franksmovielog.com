import { z } from "zod";

import { nullableNumber, nullableString } from "./utils/nullable";

/**
 * Zod schema for most watched title data.
 */
export const MostWatchedTitleSchema = z
  .object({
    count: z.number(),
    genres: z.array(z.string()),
    grade: nullableString(),
    gradeValue: nullableNumber(),
    imdbId: z.string(),
    releaseDate: z.string(),
    releaseYear: z.string(),
    reviewDate: nullableString(),
    reviewSequence: nullableNumber(),
    slug: nullableString(),
    sortTitle: z.string(),
    title: z.string(),
  })
  .transform((data) => {
    // fix zod making anything with undefined optional
    return {
      count: data.count,
      genres: data.genres,
      grade: data.grade,
      gradeValue: data.gradeValue,
      imdbId: data.imdbId,
      releaseDate: data.releaseDate,
      releaseYear: data.releaseYear,
      reviewDate: data.reviewDate,
      reviewSequence: data.reviewSequence,
      slug: data.slug,
      sortTitle: data.sortTitle,
      title: data.title,
    };
  });

/**
 * Type for most watched title data.
 */
export type MostWatchedTitle = z.infer<typeof MostWatchedTitleSchema>;
