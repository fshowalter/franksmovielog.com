import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import path from "node:path";

import { CONTENT_ROOT } from "./contentRoot";
import { loadJsonDirectory } from "./utils/loadJsonDirectory";
import { loadJsonFileAsSingleEntry } from "./utils/loadJsonFileAsSingleEntry";

const MostWatchedTitleSchema = z
  .object({
    count: z.number(),
    imdbId: z.string(),
    releaseYear: z.string(),
    reviewSlug: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    title: z.string(),
  })
  .transform(({ count, imdbId, releaseYear, reviewSlug, title }) => {
    // fix zod making anything with undefined optional
    return { count, imdbId, releaseYear, reviewSlug, title };
  });

const MostWatchedPersonViewingSchema = z
  .object({
    date: z.coerce.date(),
    medium: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    releaseYear: z.string(),
    reviewSlug: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    title: z.string(),
    venue: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
  })
  .transform(({ date, medium, releaseYear, reviewSlug, title, venue }) => {
    // fix zod making anything with undefined optional
    return { date, medium, releaseYear, reviewSlug, title, venue };
  });

const MostWatchedPersonSchema = z
  .object({
    count: z.number(),
    name: z.string(),
    slug: z
      .nullable(z.string())
      .optional()
      .transform((v) => v ?? undefined),
    viewings: z.array(MostWatchedPersonViewingSchema),
  })
  .transform(({ count, name, slug, viewings }) => {
    // fix zod making anything with undefined optional
    return { count, name, slug, viewings };
  });

export type MostWatchedPerson = z.infer<typeof MostWatchedPersonSchema>;

const DistributionSchema = z.object({
  count: z.number(),
  name: z.string(),
});

const GradeDistributionSchema = DistributionSchema.extend({
  sortValue: z.number(),
});

const YearStatsSchema = z.object({
  decadeDistribution: z.array(DistributionSchema),
  mediaDistribution: z.array(DistributionSchema),
  mostWatchedDirectors: z.array(MostWatchedPersonSchema),
  mostWatchedPerformers: z.array(MostWatchedPersonSchema),
  mostWatchedTitles: z.array(MostWatchedTitleSchema),
  mostWatchedWriters: z.array(MostWatchedPersonSchema),
  newTitleCount: z.number(),
  reviewCount: z.number(),
  titleCount: z.number(),
  venueDistribution: z.array(DistributionSchema),
  viewingCount: z.number(),
  year: z.string(),
});

const AlltimeStatsSchema = z.object({
  decadeDistribution: z.array(DistributionSchema),
  gradeDistribution: z.array(GradeDistributionSchema),
  mediaDistribution: z.array(DistributionSchema),
  mostWatchedDirectors: z.array(MostWatchedPersonSchema),
  mostWatchedPerformers: z.array(MostWatchedPersonSchema),
  mostWatchedTitles: z.array(MostWatchedTitleSchema),
  mostWatchedWriters: z.array(MostWatchedPersonSchema),
  reviewCount: z.number(),
  statsYears: z.array(z.string()),
  titleCount: z.number(),
  venueDistribution: z.array(DistributionSchema),
  viewingCount: z.number(),
  watchlistTitlesReviewedCount: z.number(),
});

export const yearStats = defineCollection({
  loader: {
    load: (ctx) =>
      loadJsonDirectory({
        directoryPath: path.join(CONTENT_ROOT, "data", "year-stats"),
        getId: (raw) => raw.year as string,
        loaderContext: ctx,
      }),
    name: "year-stats-loader",
  },
  schema: YearStatsSchema,
});

export const alltimeStats = defineCollection({
  loader: {
    load: (loaderContext) =>
      loadJsonFileAsSingleEntry({
        filePath: path.join(CONTENT_ROOT, "data", "all-time-stats.json"),
        id: "alltimeStats",
        loaderContext,
      }),
    name: "alltime-stats-loader",
  },
  schema: AlltimeStatsSchema,
});
