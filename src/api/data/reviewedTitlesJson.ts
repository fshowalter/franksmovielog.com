import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

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

const MoreTitleSchema = z.object({
  genres: z.array(z.string()),
  grade: z.string(),
  imdbId: z.string(),
  slug: z.string(),
  title: z.string(),
  year: z.string(),
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

const ReviewedTitleJsonSchema = z.object({
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
  originalTitle: z.nullable(z.string()),
  principalCastNames: z.array(z.string()),
  releaseSequence: z.string(),
  runtimeMinutes: z.number(),
  sequence: z.string(),
  slug: z.string(),
  sortTitle: z.string(),
  title: z.string(),
  writerNames: z.array(z.string()),
  year: z.string(),
});

export type ReviewedTitleJson = z.infer<typeof ReviewedTitleJsonSchema>;

async function parseAllReviewedTitlesJson() {
  const json = await fs.readFile(reviewedTitlesJsonFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return data.map((item) => {
    return ReviewedTitleJsonSchema.parse(item);
  });
}

export async function allReviewedTitlesJson(): Promise<ReviewedTitleJson[]> {
  return await parseAllReviewedTitlesJson();
}
