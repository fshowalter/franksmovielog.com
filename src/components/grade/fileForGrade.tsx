import { gradeMap } from "./gradeMap";

/**
 * Gets the file path for a grade image.
 * @param value - The grade value (e.g., "A", "B+")
 * @returns File path for the corresponding grade image
 */
export function fileForGrade(value: string): string {
  const [src] = gradeMap[value];

  return src;
}
