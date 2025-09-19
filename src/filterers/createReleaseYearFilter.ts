/**
 * Create a Release Year filter function
 */
export function createReleaseYearFilter<TValue extends { releaseYear: string }>(
  filterValue?: [string, string],
) {
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.releaseYear >= filterValue[0] && value.releaseYear <= filterValue[1]
    );
  };
}
