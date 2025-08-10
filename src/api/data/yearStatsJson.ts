import { promises as fs } from "node:fs";
import { z } from "zod";

import { DistributionSchema } from "./DistributionSchema";
import { MostWatchedPersonSchema } from "./MostWatchedPersonSchema";
import { MostWatchedTitleSchema } from "./MostWatchedTitleSchema";
import { ContentCache, generateSchemaHash } from "./utils/cache";
import { getContentPath } from "./utils/getContentPath";

const yearStatsJsonDirectory = getContentPath("data", "year-stats");

const YearStatsJsonSchema = z.object({
  decadeDistribution: z.array(DistributionSchema),
  mediaDistribution: z.array(DistributionSchema),
  mostWatchedDirectors: z.array(MostWatchedPersonSchema),
  mostWatchedPerformers: z.array(MostWatchedPersonSchema),
  mostWatchedTitles: z.array(MostWatchedTitleSchema),
  mostWatchedWriters: z.array(MostWatchedPersonSchema),
  newTitleCount: z.number(),
  titleCount: z.number(),
  venueDistribution: z.array(DistributionSchema),
  viewingCount: z.number(),
  year: z.string(),
});

export type YearStatsJson = z.infer<typeof YearStatsJsonSchema>;

// Create cache instance with schema hash
let cacheInstance: ContentCache<YearStatsJson[]> | undefined;

export async function allYearStatsJson(): Promise<YearStatsJson[]> {
  const cache = await getCache();
  const dirents = await fs.readdir(yearStatsJsonDirectory, {
    withFileTypes: true,
  });

  const jsonFiles = dirents.filter((item) => !item.isDirectory() && item.name.endsWith(".json"));
  const allFileContents = await Promise.all(
    jsonFiles.map(async (item) => {
      const filePath = `${yearStatsJsonDirectory}/${item.name}`;
      const content = await fs.readFile(filePath, "utf8");
      return { content, filePath };
    }),
  );

  // Create a combined cache key from all file contents
  const combinedContent = allFileContents
    .map(({ content, filePath }) => `${filePath}:${content}`)
    .join("\n---\n");

  return cache.get(yearStatsJsonDirectory, combinedContent, () => {
    return allFileContents.map(({ content }) => {
      const json = JSON.parse(content) as unknown;
      return YearStatsJsonSchema.parse(json);
    });
  });
}

async function getCache(): Promise<ContentCache<YearStatsJson[]>> {
  if (!cacheInstance) {
    const schemaHash = await generateSchemaHash(JSON.stringify(YearStatsJsonSchema.shape));
    cacheInstance = new ContentCache<YearStatsJson[]>("year-stats-json", schemaHash);
  }
  return cacheInstance;
}
