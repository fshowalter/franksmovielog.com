import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";
import { nullableString } from "./utils/nullable";

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
    releaseYear: z.string().optional(),
    slug: z.string(),
    title: z.string(),
    year: z.string().optional(),
  })
  .transform((data) => {
    // Handle both old and new field names
    const releaseYear = data.releaseYear || data.year || "";

    // fix zod making anything with undefined optional
    return {
      genres: data.genres,
      grade: data.grade,
      imdbId: data.imdbId,
      releaseYear,
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

const ReviewedTitleJsonSchema = z
  .object({
    castAndCrew: z.array(CastAndCrewMemberSchema),
    collections: z.array(CollectionSchema),
    countries: z.array(z.string()),
    directorNames: z.array(z.string()),
    genres: z.array(z.string()),
    gradeValue: z.number(),
    imdbId: z.string(),
    moreCastAndCrew: z.array(MoreCastAndCrewMemberSchema),
    moreCollections: z.array(MoreCollectionsSchema),
    moreReviews: z.array(MoreTitleSchema),
    originalTitle: nullableString(),
    principalCastNames: z.array(z.string()),
    releaseSequence: z.string(),
    releaseYear: z.string().optional(),
    reviewSequence: z.string().optional(),
    runtimeMinutes: z.number(),
    sequence: z.string().optional(),
    slug: z.string(),
    sortTitle: z.string(),
    title: z.string(),
    writerNames: z.array(z.string()),
    year: z.string().optional(),
  })
  .transform((data) => {
    // Handle both old and new field names
    const releaseYear = data.releaseYear || data.year || "";
    const reviewSequence = data.reviewSequence || data.sequence || "";

    // fix zod making anything with undefined optional
    return {
      castAndCrew: data.castAndCrew,
      collections: data.collections,
      countries: data.countries,
      directorNames: data.directorNames,
      genres: data.genres,
      gradeValue: data.gradeValue,
      imdbId: data.imdbId,
      moreCastAndCrew: data.moreCastAndCrew,
      moreCollections: data.moreCollections,
      moreReviews: data.moreReviews,
      originalTitle: data.originalTitle,
      principalCastNames: data.principalCastNames,
      releaseSequence: data.releaseSequence,
      releaseYear,
      reviewSequence,
      runtimeMinutes: data.runtimeMinutes,
      slug: data.slug,
      sortTitle: data.sortTitle,
      title: data.title,
      writerNames: data.writerNames,
    };
  });

export type ReviewedTitleJson = z.infer<typeof ReviewedTitleJsonSchema>;

export async function allReviewedTitlesJson(): Promise<ReviewedTitleJson[]> {
  return await parseAllReviewedTitlesJson();
}

async function parseAllReviewedTitlesJson() {
  const json = await fs.readFile(reviewedTitlesJsonFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return data.map((item) => {
    return ReviewedTitleJsonSchema.parse(item);
  });
}
