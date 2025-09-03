import { z } from "zod";

import { nullableNumber, nullableString } from "./utils/nullable";

export const MostWatchedTitleSchema = z
  .object({
    count: z.number(),
    genres: z.array(z.string()),
    grade: nullableString(),
    gradeValue: nullableNumber(),
    imdbId: z.string(),
    releaseSequence: z.number(),
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
      releaseSequence: data.releaseSequence,
      releaseYear: data.releaseYear,
      reviewDate: data.reviewDate,
      reviewSequence: data.reviewSequence,
      slug: data.slug,
      sortTitle: data.sortTitle,
      title: data.title,
    };
  });

export type MostWatchedTitle = z.infer<typeof MostWatchedTitleSchema>;
