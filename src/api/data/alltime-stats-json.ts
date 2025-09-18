import { promises as fs } from "node:fs";
import { z } from "zod";

import { perfLogger } from "~/utils/performanceLogger";

import { getContentPath } from "./utils/getContentPath";

const alltimeStatsFile = getContentPath("data", "all-time-stats.json");

import { DistributionSchema } from "./DistributionSchema";
import { MostWatchedPersonSchema } from "./MostWatchedPersonSchema";
import { MostWatchedTitleSchema } from "./MostWatchedTitleSchema";

const GradeDistributionSchema = DistributionSchema.extend({
  sortValue: z.number(),
});

const AlltimeStatsJsonSchema = z.object({
  decadeDistribution: z.array(DistributionSchema),
  gradeDistribution: z.array(GradeDistributionSchema),
  mediaDistribution: z.array(DistributionSchema),
  mostWatchedDirectors: z.array(MostWatchedPersonSchema),
  mostWatchedPerformers: z.array(MostWatchedPersonSchema),
  mostWatchedTitles: z.array(MostWatchedTitleSchema),
  mostWatchedWriters: z.array(MostWatchedPersonSchema),
  reviewCount: z.number(),
  titleCount: z.number(),
  venueDistribution: z.array(DistributionSchema),
  viewingCount: z.number(),
  watchlistTitlesReviewedCount: z.number(),
});

/**
 * Type for all-time statistics JSON data.
 */
export type AlltimeStatsJson = z.infer<typeof AlltimeStatsJsonSchema>;

/**
 * Loads and parses all-time statistics from JSON file.
 * @returns Parsed all-time statistics data
 */
export async function alltimeStatsJson(): Promise<AlltimeStatsJson> {
  return await perfLogger.measure("alltimeStatsJson", async () => {
    const json = await fs.readFile(alltimeStatsFile, "utf8");
    const data = JSON.parse(json) as unknown[];

    return AlltimeStatsJsonSchema.parse(data);
  });
}
