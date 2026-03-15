import type { LoaderContext } from "astro/loaders";

import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";
import path from "node:path";

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
    grade: z.string(),
    gradeValue: z.number(),
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
    reviewDate: z.coerce.date(),
    reviewSequence: z.number(),
    runtimeMinutes: z.number(),
    slug: z.string(),
    sortTitle: z.string(),
    title: z.string(),
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
      reviewDate,
      reviewSequence,
      runtimeMinutes,
      slug,
      sortTitle,
      title,
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
        reviewDate,
        reviewSequence,
        runtimeMinutes,
        slug,
        sortTitle,
        title,
        writerNames,
      };
    },
  );

export const reviewedTitles = defineCollection({
  loader: {
    load: (loaderContext: LoaderContext) =>
      loadJsonDirectory({
        directoryPath: path.join(CONTENT_ROOT, "data", "reviewed-titles"),
        loaderContext,
      }),
    name: "reviewed-titles-loader",
  },
  schema: ReviewedTitleSchema,
});
