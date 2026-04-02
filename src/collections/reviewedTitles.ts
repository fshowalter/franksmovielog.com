import type { LoaderContext } from "astro/loaders";

import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";
import path from "node:path";

import { GRADE_VALUES, GRADES, gradeToValue } from "~/utils/grades";

import { CONTENT_ROOT } from "./contentRoot";
import { loadJsonDirectory } from "./utils/loadJsonDirectory";

const CreditKindSchema = z.enum(["writer", "director", "performer"]);

const MoreCastAndCrewMemberSchema = z.object({
  creditKind: CreditKindSchema,
  name: z.string(),
  slug: z.string(),
  titles: z.array(reference("reviewedTitles")),
});

const MoreCollectionsSchema = z.object({
  name: z.string(),
  slug: z.string(),
  titles: z.array(reference("reviewedTitles")),
});

const ReviewedTitleSchema = z
  .object({
    countries: z.array(z.string()),
    directorNames: z.array(z.string()),
    genres: z.array(z.string()),
    grade: z.enum(GRADES),
    gradeValue: z.literal(GRADE_VALUES),
    imdbId: z.string(),
    moreCastAndCrew: z.array(MoreCastAndCrewMemberSchema),
    moreCollections: z.array(MoreCollectionsSchema),
    moreReviews: z.array(reference("reviewedTitles")),
    originalTitle: z
      .nullable(z.string())
      .transform((data) => data ?? undefined),
    principalCastNames: z.array(z.string()),
    releaseDate: z.string(),
    releaseYear: z.string(),
    review: reference("reviews"),
    reviewDate: z.coerce.date(),
    reviewSequence: z.string(),
    runtimeMinutes: z.number(),
    sortTitle: z.string(),
    title: z.string(),
    viewings: reference("viewings"),
    writerNames: z.array(z.string()),
  })
  .transform(
    ({
      countries,
      directorNames,
      genres,
      grade,
      gradeValue,
      imdbId,
      moreCastAndCrew,
      moreCollections,
      moreReviews,
      originalTitle,
      principalCastNames,
      releaseDate,
      releaseYear,
      review,
      reviewDate,
      reviewSequence,
      runtimeMinutes,
      sortTitle,
      title,
      viewings,
      writerNames,
    }) => {
      // fix zod making anything with undefined optional
      return {
        countries,
        directorNames,
        genres,
        grade,
        gradeValue,
        imdbId,
        moreCastAndCrew,
        moreCollections,
        moreReviews,
        originalTitle,
        principalCastNames,
        releaseDate,
        releaseYear,
        review,
        reviewDate,
        reviewSequence,
        runtimeMinutes,
        sortTitle,
        title,
        viewings,
        writerNames,
      };
    },
  );

const ReviewTitleGradeSchema = z.object({
  grade: z.enum(GRADES),
});

export const reviewedTitles = defineCollection({
  loader: {
    load: (loaderContext: LoaderContext) =>
      loadJsonDirectory({
        buildData: ({ raw }) => {
          const { grade } = ReviewTitleGradeSchema.parse(raw);

          raw["gradeValue"] = gradeToValue(grade);

          return raw;
        },
        directoryPath: path.join(CONTENT_ROOT, "data", "reviewed-titles"),
        getId: (raw) => raw.review as string,
        loaderContext,
      }),
    name: "reviewed-titles-loader",
  },
  schema: ReviewedTitleSchema,
});
