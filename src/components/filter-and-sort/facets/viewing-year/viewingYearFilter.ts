export type FilterableValue = { viewingYear: string };
type Filters = { viewingYear?: [string, string] };

export function createViewingYearFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters.viewingYear;
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.viewingYear >= filterValue[0] && value.viewingYear <= filterValue[1]
    );
  };
}
