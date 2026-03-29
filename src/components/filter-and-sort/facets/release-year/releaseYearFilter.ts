export type FilterableValue = { releaseYear: string };
type Filters = { releaseYear?: [string, string] };

export function createReleaseYearFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters.releaseYear;
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.releaseYear >= filterValue[0] && value.releaseYear <= filterValue[1]
    );
  };
}
