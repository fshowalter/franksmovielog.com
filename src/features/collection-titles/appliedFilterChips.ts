import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import type { CollectionTitlesFiltersValues } from "./CollectionTitles.reducer";

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
 * Builds an array of FilterChip objects from active filter values for the Collection Titles page.
 *
 * Converts the structured filter values (genres, gradeValue, releaseYear, reviewYear, reviewedStatus, title)
 * into a flat array of chips that can be displayed in the AppliedFilters component.
 *
 * @param filterValues - Current active filter values
 * @returns Array of FilterChip objects representing active filters
 */
export function buildAppliedFilterChips(
  filterValues: CollectionTitlesFiltersValues,
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
  if (filterValues.releaseYear) {
    const [minYear, maxYear] = filterValues.releaseYear;
    chips.push({
      category: "Release Year",
      id: "releaseYear",
      label: minYear === maxYear ? minYear : `${minYear}-${maxYear}`,
    });
  }

  // Review Year chip (range)
  if (filterValues.reviewYear) {
    const [minYear, maxYear] = filterValues.reviewYear;
    chips.push({
      category: "Review Year",
      id: "reviewYear",
      label: minYear === maxYear ? minYear : `${minYear}-${maxYear}`,
    });
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
