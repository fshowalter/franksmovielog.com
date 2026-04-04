export type FilterableValue = { name: string; sortName: string };
type Filters = { name?: string };

export function createNameFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters.name;
  if (!filterValue) return;
  return (value: TValue): boolean => {
    const filterValueLowerCase = filterValue.toLocaleLowerCase();
    return (
      value.name.toLocaleLowerCase().includes(filterValueLowerCase) ||
      value.sortName.toLocaleLowerCase().includes(filterValueLowerCase)
    );
  };
}
