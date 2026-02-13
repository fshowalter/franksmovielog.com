import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import type { ReviewsFiltersValues } from "./reducer";

// Grade number to letter mapping
const GRADE_MAP: Record<number, string> = {
  1: "F",
  2: "D-",
  3: "D",
  4: "D+",
  5: "C-",
  6: "C",
  7: "C+",
  8: "B-",
  9: "B",
  10: "B+",
  11: "A-",
  12: "A",
  13: "A+",
};

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
    const minLetter = gradeNumberToLetter(minGrade);
    const maxLetter = gradeNumberToLetter(maxGrade);

    // Only show if not the full range (1-13)
    if (minGrade !== 1 || maxGrade !== 13) {
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
    const availableMax =
      context.distinctReleaseYears[context.distinctReleaseYears.length - 1];

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
    const availableMax =
      context.distinctReviewYears[context.distinctReviewYears.length - 1];

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

/**
 * Converts a grade number (1-13) to a letter grade (F to A+).
 * @param gradeNumber - Grade as a number (1-13)
 * @returns Letter grade (e.g., "A+", "B-", "F")
 */
function gradeNumberToLetter(gradeNumber: number): string {
  return GRADE_MAP[gradeNumber] || "?";
}
