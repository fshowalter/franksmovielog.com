import { collator } from "~/utils/reducerUtils";

import type { YearStatsJson } from "./data/yearStatsJson";

import { allYearStatsJson } from "./data/yearStatsJson";

export type YearStats = YearStatsJson & {};

const cache: Record<string, YearStats> = {};
const statYears = new Set<string>();

export async function allStatYears() {
  if (statYears.size > 0) {
    return [...statYears].sort((a, b) => collator.compare(a, b));
  }

  const yearStats = await allYearStatsJson();

  for (const stats of yearStats) {
    if (stats.year > "2011") {
      statYears.add(stats.year);
    }
  }

  return [...statYears].sort((a, b) => collator.compare(a, b));
}

export async function statsForYear(year: string): Promise<YearStats> {
  if (year in cache) {
    return cache[year];
  }

  const yearStats = await allYearStatsJson();

  for (const stats of yearStats) {
    cache[stats.year] = stats;
  }

  return cache[year];
}
