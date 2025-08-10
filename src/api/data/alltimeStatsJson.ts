import { promises as fs } from "node:fs";
import { z } from "zod";

import { ContentCache, generateSchemaHash } from "./utils/cache";
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

export type AlltimeStatsJson = z.infer<typeof AlltimeStatsJsonSchema>;

// Create cache instance with schema hash
let cacheInstance: ContentCache<AlltimeStatsJson> | undefined;

export async function alltimeStatsJson(): Promise<AlltimeStatsJson> {
  const cache = await getCache();
  const fileContents = await fs.readFile(alltimeStatsFile, "utf8");
  
  return cache.get(alltimeStatsFile, fileContents, (content) => {
    const data = JSON.parse(content) as unknown;
    return AlltimeStatsJsonSchema.parse(data);
  });
}

async function getCache(): Promise<ContentCache<AlltimeStatsJson>> {
  if (!cacheInstance) {
    const schemaHash = await generateSchemaHash(JSON.stringify(AlltimeStatsJsonSchema.shape));
    cacheInstance = new ContentCache<AlltimeStatsJson>("alltime-stats-json", schemaHash);
  }
  return cacheInstance;
}
