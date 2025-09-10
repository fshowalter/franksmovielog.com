import { collator } from "~/utils/collator";

/**
 * Common sort helper for numbers
 */
export function sortNumber(a: number, b: number): number {
  return a - b;
}

/**
 * Common sort helper for strings using locale-aware comparison
 */
export function sortString(a: string, b: string): number {
  return collator.compare(a, b);
}
