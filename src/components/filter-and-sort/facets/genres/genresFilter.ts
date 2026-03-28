export function createGenresCountMap<TValue extends { genres: string[] }>(
  values: readonly TValue[],
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    for (const genre of value.genres) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    }
  }
  return counts;
}

export function createGenresFilter<TValue extends { genres: string[] }>(
  filterValue?: readonly string[],
) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) =>
    filterValue.some((genre) => value.genres.includes(genre));
}
