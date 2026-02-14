// AIDEV-NOTE: Single source of truth for grade number to letter mapping
// Used by GradeField component and filter chip displays across the site

/**
 * Maps grade numbers (2-16) to letter grades (F- to A+).
 * DO NOT modify this mapping without updating all grade-related functionality.
 */
const GRADE_MAP: Record<number, string> = {
  2: "F-",
  3: "F",
  4: "F+",
  5: "D-",
  6: "D",
  7: "D+",
  8: "C-",
  9: "C",
  10: "C+",
  11: "B-",
  12: "B",
  13: "B+",
  14: "A-",
  15: "A",
  16: "A+",
};

/**
 * Converts a grade number (2-16) to a letter grade (F- to A+).
 * @param grade - Grade as a number (2-16)
 * @returns Letter grade (e.g., "A+", "B-", "F")
 */
export function gradeToLetter(grade: number): string {
  return GRADE_MAP[grade] || grade.toString();
}
