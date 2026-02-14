import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { gradeToLetter } from "~/utils/grades";

import type { ReviewsFiltersValues } from "./reducer";

/**
 * Builds an array of FilterChip objects from active filter values for the Reviews page.
 *
 * Converts the structured filter values (genres, gradeValue, releaseYear, reviewYear, title)
 * into a flat array of chips that can be displayed in the AppliedFilters component.
 *
 * @param filterValues - Current active filter values
 * @param context - Optional context with available years for full-range checks
 * @param context.distinctReleaseYears - Available release years
 * @param context.distinctReviewYears - Available review years
 * @returns Array of FilterChip objects representing active filters
 *
 * @example
 * ```ts
 * buildAppliedFilterChips({
 *   genres: ["Horror", "Action"],
 *   gradeValue: [11, 10], // A- to B+
 *   releaseYear: ["1980", "1989"],
 *   title: "alien"
 * }, {
 *   distinctReleaseYears: ["1920", "2024"],
 *   distinctReviewYears: ["2018", "2024"]
 * })
 * // Returns:
 * // [
 * //   { id: "genre-horror", category: "Genre", label: "Horror" },
 * //   { id: "genre-action", category: "Genre", label: "Action" },
 * //   { id: "gradeValue", category: "Grade", label: "A- to B+" },
 * //   { id: "releaseYear", category: "Release Year", label: "1980-1989" },
 * //   { id: "title", category: "Search", label: "alien" }
 * // ]
 * ```
 */
export function buildAppliedFilterChips(
  filterValues: ReviewsFiltersValues,
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
