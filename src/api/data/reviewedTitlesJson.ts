import { promises as fs } from "node:fs";
import { z } from "zod";

import { perfLogger } from "~/utils/performanceLogger";

import { getContentPath } from "./utils/getContentPath";
import { nullableNumber, nullableString } from "./utils/nullable";

const reviewedTitlesJsonFile = getContentPath("data", "reviewed-titles.json");

const CastAndCrewMemberSchema = z.object({
  creditedAs: z.array(z.string()),
  name: z.string(),
  slug: z.string(),
});

const CollectionSchema = z.object({
  name: z.string(),
  slug: z.string(),
});

const MoreTitleSchema = z
  .object({
    genres: z.array(z.string()),
    grade: z.string(),
    imdbId: z.string(),
    releaseYear: z.string(),
    slug: z.string(),
    title: z.string(),
  })
  .transform((data) => {
    // fix zod making anything with undefined optional
    return {
      genres: data.genres,
      grade: data.grade,
      imdbId: data.imdbId,
      releaseYear: data.releaseYear,
      slug: data.slug,
      title: data.title,
    };
  });

const CreditKindSchema = z.enum(["writer", "director", "performer"]);

const MoreCastAndCrewMemberSchema = z.object({
  creditKind: CreditKindSchema,
  name: z.string(),
  slug: z.string(),
  titles: z.array(MoreTitleSchema),
});

const MoreCollectionsSchema = z.object({
  name: z.string(),
  slug: z.string(),
  titles: z.array(MoreTitleSchema),
});

const ViewingSchema = z
  .object({
    genres: z.array(z.string()),
    grade: nullableString(),
    gradeValue: nullableNumber(),
    imdbId: z.string(),
    medium: nullableString(),
    mediumNotes: nullableString(),
    releaseSequence: z.number(),
    releaseYear: z.string(),
    reviewDate: nullableString(),
    reviewSequence: z.number(),
    slug: nullableString(),
    sortTitle: z.string(),
    title: z.string(),
    venue: nullableString(),
    venueNotes: nullableString(),
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
      mediumNotes: data.mediumNotes,
      releaseSequence: data.releaseSequence,
      releaseYear: data.releaseYear,
      reviewDate: data.reviewDate,
      reviewSequence: data.reviewSequence,
      slug: data.slug,
      sortTitle: data.sortTitle,
      title: data.title,
      venue: data.venue,
      venueNotes: data.venueNotes,
      viewingDate: data.viewingDate,
      viewingSequence: data.viewingSequence,
    };
  });

const ReviewedTitleJsonSchema = z
  .object({
    castAndCrew: z.array(CastAndCrewMemberSchema),
    collections: z.array(CollectionSchema),
    countries: z.array(z.string()),
    directorNames: z.array(z.string()),
    genres: z.array(z.string()),
    grade: z.string(),
    gradeValue: z.number(),
    imdbId: z.string(),
    moreCastAndCrew: z.array(MoreCastAndCrewMemberSchema),
    moreCollections: z.array(MoreCollectionsSchema),
    moreReviews: z.array(MoreTitleSchema),
    originalTitle: nullableString(),
    principalCastNames: z.array(z.string()),
    releaseSequence: z.number(),
    releaseYear: z.string(),
    reviewDate: z.date({ coerce: true }),
    reviewSequence: z.number(),
    runtimeMinutes: z.number(),
    slug: z.string(),
    sortTitle: z.string(),
    title: z.string(),
    viewings: z.array(ViewingSchema),
    writerNames: z.array(z.string()),
  })
  .transform((data) => {
    // fix zod making anything with undefined optional
    return {
      castAndCrew: data.castAndCrew,
      collections: data.collections,
      countries: data.countries,
      directorNames: data.directorNames,
      genres: data.genres,
      grade: data.grade,
      gradeValue: data.gradeValue,
      imdbId: data.imdbId,
      moreCastAndCrew: data.moreCastAndCrew,
      moreCollections: data.moreCollections,
      moreReviews: data.moreReviews,
      originalTitle: data.originalTitle,
      principalCastNames: data.principalCastNames,
      releaseSequence: data.releaseSequence,
      releaseYear: data.releaseYear,
      reviewDate: data.reviewDate,
      reviewSequence: data.reviewSequence,
      runtimeMinutes: data.runtimeMinutes,
      slug: data.slug,
      sortTitle: data.sortTitle,
      title: data.title,
      viewings: data.viewings,
      writerNames: data.writerNames,
    };
  });

export type ReviewedTitleJson = z.infer<typeof ReviewedTitleJsonSchema>;

export async function allReviewedTitlesJson(): Promise<ReviewedTitleJson[]> {
  return await perfLogger.measure("allReviewedTitlesJson", async () => {
    return await parseAllReviewedTitlesJson();
  });
}

async function parseAllReviewedTitlesJson() {
  const json = await fs.readFile(reviewedTitlesJsonFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return data.map((item) => {
    return ReviewedTitleJsonSchema.parse(item);
  });
}
