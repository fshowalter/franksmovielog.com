import { promises as fs } from "node:fs";
import { z } from "zod";

import { getContentPath } from "./utils/getContentPath";

const yearStatsJsonDirectory = getContentPath("data", "year-stats");

const Distribution = z.object({
  count: z.number(),
  name: z.string(),
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

const YearStatsJsonSchema = z.object({
  decadeDistribution: z.array(Distribution),
  mediaDistribution: z.array(Distribution),
  mostWatchedDirectors: z.array(MostWatchedPersonSchema),
  mostWatchedPerformers: z.array(MostWatchedPersonSchema),
  mostWatchedTitles: z.array(MostWatchedTitle),
  mostWatchedWriters: z.array(MostWatchedPersonSchema),
  newTitleCount: z.number(),
  titleCount: z.number(),
  viewingCount: z.number(),
  year: z.string(),
});

export type YearStatsJson = z.infer<typeof YearStatsJsonSchema>;

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

export async function allYearStatsJson(): Promise<YearStatsJson[]> {
  return await parseAllYearStatsJson();
}
