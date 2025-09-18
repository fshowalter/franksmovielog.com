import type { AlltimeStatsJson } from "./data/alltime-stats-json";
import type { YearStatsJson } from "./data/year-stats-json";

import { alltimeStatsJson } from "./data/alltime-stats-json";
import { allYearStatsJson } from "./data/year-stats-json";

/**
 * Statistics for all time.
 */
export type AlltimeStats = AlltimeStatsJson & {};

/**
 * Statistics for a specific year.
 */
export type YearStats = YearStatsJson & {};

const cache: Record<string, YearStats> = {};
const statYears = new Set<string>();

/**
 * Retrieves all years for which statistics are available.
 * Filters out years before 2012 and returns them sorted.
 * @returns Array of year strings sorted in ascending order
 */
export async function allStatYears() {
  if (statYears.size > 0) {
    return [...statYears].toSorted();
  }

  const yearStats = await allYearStatsJson();

  for (const stats of yearStats) {
    if (stats.year > "2011") {
      statYears.add(stats.year);
    }
  }

  return [...statYears].toSorted();
}

/**
 * Retrieves all-time viewing statistics.
 * @returns All-time statistics data
 */
export async function alltimeStats(): Promise<AlltimeStats> {
  return await alltimeStatsJson();
}

/**
 * Retrieves viewing statistics for a specific year.
 * Caches results for improved performance.
 * @param year - The year to retrieve statistics for
 * @returns Statistics data for the specified year
 */
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
