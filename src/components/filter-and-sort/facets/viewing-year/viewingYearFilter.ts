export function createViewingYearFilter<TValue extends { viewingYear: string }>(
  filterValue?: [string, string],
) {
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.viewingYear >= filterValue[0] && value.viewingYear <= filterValue[1]
    );
  };
}
