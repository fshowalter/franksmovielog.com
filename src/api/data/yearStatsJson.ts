import { promises as fs } from "node:fs";
import { z } from "zod";

import { DistributionSchema } from "./DistributionSchema";
import { MostWatchedPersonSchema } from "./MostWatchedPersonSchema";
import { MostWatchedTitleSchema } from "./MostWatchedTitleSchema";
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

export async function allYearStatsJson(): Promise<YearStatsJson[]> {
  return await parseAllYearStatsJson();
}

async function parseAllYearStatsJson() {
  const dirents = await fs.readdir(yearStatsJsonDirectory, {
    withFileTypes: true,
  });

  return Promise.all(
    dirents
      .filter((item) => !item.isDirectory() && item.name.endsWith(".json"))
      .map(async (item) => {
        const fileContents = await fs.readFile(
          `${yearStatsJsonDirectory}/${item.name}`,
          "utf8",
        );

        const json = JSON.parse(fileContents) as unknown;
        return YearStatsJsonSchema.parse(json);
      }),
  );
}
