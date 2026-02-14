import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { gradeToLetter } from "~/utils/grades";

import type { CastAndCrewMemberTitlesFiltersValues } from "./CastAndCrewMemberTitles.reducer";

/**
 * Builds an array of FilterChip objects from active filter values for the Cast & Crew Member Titles page.
 *
 * Converts the structured filter values (genres, gradeValue, releaseYear, reviewYear, reviewedStatus, creditedAs, title)
 * into a flat array of chips that can be displayed in the AppliedFilters component.
 *
 * @param filterValues - Current active filter values
 * @param context - Optional context with available years for full-range checks
 * @param context.distinctReleaseYears - Available release years
 * @param context.distinctReviewYears - Available review years
 * @returns Array of FilterChip objects representing active filters
 */
export function buildAppliedFilterChips(
  filterValues: CastAndCrewMemberTitlesFiltersValues,
  context?: {
    distinctReleaseYears?: readonly string[];
    distinctReviewYears?: readonly string[];
  },
): FilterChip[] {
  const chips: FilterChip[] = [];

  // Genre chips (multi-select)
  if (filterValues.genres && filterValues.genres.length > 0) {
    for (const genre of filterValues.genres) {
      chips.push({
        category: "Genre",
        id: `genre-${genre.toLowerCase().replaceAll(" ", "-")}`,
        label: genre,
      });
    }
  }

  // Grade chip (range)
  if (filterValues.gradeValue) {
    const [minGrade, maxGrade] = filterValues.gradeValue;
    const minLetter = gradeToLetter(minGrade);
    const maxLetter = gradeToLetter(maxGrade);

    // Only show if not the full range (2-16)
    if (minGrade !== 2 || maxGrade !== 16) {
      chips.push({
        category: "Grade",
        id: "gradeValue",
        label:
          minLetter === maxLetter ? minLetter : `${maxLetter} to ${minLetter}`,
      });
    }
  }

  // Release Year chip (range)
  // AIDEV-NOTE: Only show chip if range is not full default (FILTER_REDESIGN_SPEC.md Issue 3)
  if (filterValues.releaseYear && context?.distinctReleaseYears) {
    const [minYear, maxYear] = filterValues.releaseYear;
    const availableMin = context.distinctReleaseYears[0];
    const availableMax = context.distinctReleaseYears.at(-1)!;

    // Only show chip if not full range
    if (minYear !== availableMin || maxYear !== availableMax) {
      chips.push({
        category: "Release Year",
        id: "releaseYear",
        label: minYear === maxYear ? minYear : `${minYear}-${maxYear}`,
      });
    }
  }

  // Review Year chip (range)
  // AIDEV-NOTE: Only show chip if range is not full default (FILTER_REDESIGN_SPEC.md Issue 3)
  if (filterValues.reviewYear && context?.distinctReviewYears) {
    const [minYear, maxYear] = filterValues.reviewYear;
    const availableMin = context.distinctReviewYears[0];
    const availableMax = context.distinctReviewYears.at(-1)!;

    // Only show chip if not full range
    if (minYear !== availableMin || maxYear !== availableMax) {
      chips.push({
        category: "Review Year",
        id: "reviewYear",
        label: minYear === maxYear ? minYear : `${minYear}-${maxYear}`,
      });
    }
  }

  // Reviewed Status chips (multi-select)
  if (filterValues.reviewedStatus && filterValues.reviewedStatus.length > 0) {
    for (const status of filterValues.reviewedStatus) {
      chips.push({
        category: "Reviewed Status",
        id: `reviewedStatus-${status.toLowerCase().replaceAll(" ", "-")}`,
        label: status,
      });
    }
  }

  // Credited As chips (multi-select)
  if (filterValues.creditedAs && filterValues.creditedAs.length > 0) {
    for (const credit of filterValues.creditedAs) {
      chips.push({
        category: "Credited As",
        id: `creditedAs-${credit.toLowerCase()}`,
        label: credit,
      });
    }
  }

  // Title search chip
  if (filterValues.title && filterValues.title.trim() !== "") {
    chips.push({
      category: "Search",
      id: "title",
      label: filterValues.title,
    });
  }

  return chips;
}
