import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { gradeToLetter } from "~/utils/grades";

const GRADE_MIN = 2;
const GRADE_MAX = 16;

/**
 * Builds a grade range chip.
 * Returns [] if the grade range covers the full range (GRADE_MIN to GRADE_MAX).
 */
export function buildGradeChip(
  gradeValue: readonly [number, number] | undefined,
): FilterChip[] {
  if (!gradeValue) {
    return [];
  }
  const [min, max] = gradeValue;
  if (min === GRADE_MIN && max === GRADE_MAX) {
    return [];
  }
  const minLetter = gradeToLetter(min);
  const maxLetter = gradeToLetter(max);
  const displayText =
    minLetter === maxLetter
      ? `Grade: ${minLetter}`
      : `Grade: ${minLetter} to ${maxLetter}`;
  return [{ displayText, key: "gradeValue" }];
}

/**
 * Builds chips for a multi-select filter.
 * Returns one chip per value with the given category and an id of `${id}-${slug}`.
 */
export function buildMultiSelectChips({
  id,
  values,
}: {
  id: string;
  values: readonly string[] | undefined;
}): FilterChip[] {
  if (!values || values.length === 0) {
    return [];
  }
  return values.map((value) => ({
    displayText: value,
    key: `${id}-${value.toLowerCase().replaceAll(" ", "-")}`,
    value,
  }));
}

/**
 * Builds a search chip for a text filter value.
 * Returns a chip with category "Search" if value is non-empty, otherwise [].
 */
export function buildSearchChip({
  id,
  value,
}: {
  id: string;
  value: string | undefined;
}): FilterChip[] {
  if (!value || value.trim() === "") {
    return [];
  }
  return [{ displayText: `Search: ${value.trim()}`, key: id }];
}

/**
 * Builds a year range chip.
 * Returns [] if the range covers all distinct years or if no value/years are provided.
 */
export function buildYearRangeChip({
  category,
  distinctYears,
  id,
  value,
}: {
  category: string;
  distinctYears: readonly string[];
  id: string;
  value: readonly [string, string] | undefined;
}): FilterChip[] {
  if (!value || distinctYears.length === 0) {
    return [];
  }
  const [minYear, maxYear] = value;
  const fullMin = distinctYears[0];
  const fullMax = distinctYears.at(-1)!;
  if (minYear === fullMin && maxYear === fullMax) {
    return [];
  }
  const range = minYear === maxYear ? minYear : `${minYear} to ${maxYear}`;
  return [{ displayText: `${category}: ${range}`, key: id }];
}
