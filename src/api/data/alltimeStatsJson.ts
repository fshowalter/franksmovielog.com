import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const alltimeStatsFile = getContentPath("data", "all-time-stats.json");

const Distribution = z.object({
  count: z.number(),
  name: z.string(),
});

const GradeDistribution = Distribution.extend({
  sortValue: z.number(),
});

const MostWatchedTitle = z.object({
  count: z.number(),
  imdbId: z.string(),
  slug: z.nullable(z.string()),
  title: z.string(),
  year: z.string(),
});

const MostWatchedPersonViewing = z.object({
  date: z.string(),
  medium: z.nullable(z.string()),
  sequence: z.number(),
  slug: z.nullable(z.string()),
  title: z.string(),
  venue: z.nullable(z.string()),
  year: z.string(),
});

const MostWatchedPersonSchema = z.object({
  count: z.number(),
  name: z.string(),
  slug: z.nullable(z.string()),
  viewings: z.array(MostWatchedPersonViewing),
});

const AlltimeStatsJsonSchema = z.object({
  decadeDistribution: z.array(Distribution),
  gradeDistribution: z.array(GradeDistribution),
  mediaDistribution: z.array(Distribution),
  mostWatchedDirectors: z.array(MostWatchedPersonSchema),
  mostWatchedPerformers: z.array(MostWatchedPersonSchema),
  mostWatchedTitles: z.array(MostWatchedTitle),
  mostWatchedWriters: z.array(MostWatchedPersonSchema),
  reviewCount: z.number(),
  titleCount: z.number(),
  viewingCount: z.number(),
  watchlistTitlesReviewedCount: z.number(),
});

export type AlltimeStatsJson = z.infer<typeof AlltimeStatsJsonSchema>;

export async function alltimeStatsJson(): Promise<AlltimeStatsJson> {
  const json = await fs.readFile(alltimeStatsFile, "utf8");
  const data = JSON.parse(json) as unknown[];

  return AlltimeStatsJsonSchema.parse(data);
}
