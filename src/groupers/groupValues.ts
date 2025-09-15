export type GroupFn<TValue, TSort extends string> = (
  value: TValue,
  sort: TSort,
) => string;

export function getGroupLetter(str: string): string {
  const letter = str.slice(0, 1);

  // Check if the character is non-alphabetic (same in upper and lower case)
  if (letter.toLowerCase() === letter.toUpperCase()) {
    return "#";
  }

  return letter.toLocaleUpperCase();
}

export function groupValues<TValue, TSort extends string>(
  values: TValue[],
  sort: TSort,
  grouper: GroupFn<TValue, TSort>,
) {
  const grouped = new Map<string, TValue[]>();

  for (const value of values) {
    const key = grouper(value, sort);
    const group = grouped.get(key) || [];
    group.push(value);
    grouped.set(key, group);
  }

  return grouped;
}
