/**
 * Generic reducer utility functions that can be used by any reducer.
 * These functions don't depend on specific state types and provide
 * common functionality for sorting, grouping, and building reducer helpers.
 */

import { collator } from "~/utils/collator";

/**
 * Type for functions that group items
 */
export type GroupFn<TItem, TSortValue> = (
  items: TItem[],
  sortValue: TSortValue,
) => Map<string, TItem[]>;

/**
 * Build group values helper - groups items by a key function
 */
export function buildGroupValues<TItem, TSortValue>(
  keyFn: (item: TItem, sortValue: TSortValue) => string,
): GroupFn<TItem, TSortValue> {
  return function groupValues(
    items: TItem[],
    sortValue: TSortValue,
  ): Map<string, TItem[]> {
    const grouped = new Map<string, TItem[]>();

    for (const item of items) {
      const key = keyFn(item, sortValue);
      const group = grouped.get(key) || [];
      group.push(item);
      grouped.set(key, group);
    }

    return grouped;
  };
}

/**
 * Build sort values helper - creates a sort function from a map of comparers
 */
export function buildSortValues<V, S extends string>(
  sortMap: Record<S, (a: V, b: V) => number>,
) {
  return (values: V[], sortOrder: S): V[] => {
    const comparer = sortMap[sortOrder];
    return [...values].sort(comparer);
  };
}

/**
 * Gets the group letter for a given string, typically used for alphabetical grouping.
 * Non-alphabetic characters are grouped under "#".
 *
 * @param str - The string to get the group letter from
 * @returns The uppercase first letter or "#" for non-alphabetic characters
 */
export function getGroupLetter(str: string): string {
  const letter = str.slice(0, 1);

  // Check if the character is non-alphabetic (same in upper and lower case)
  if (letter.toLowerCase() === letter.toUpperCase()) {
    return "#";
  }

  return letter.toLocaleUpperCase();
}

/**
 * Sort helper for numeric values
 */
export function sortNumber(a: number, b: number): number {
  return a - b;
}

/**
 * Sort helper for string values using locale-aware comparison
 */
export function sortString(a: string, b: string): number {
  return collator.compare(a, b);
}