export type FilterableValue = { name: string; sortName: string };
type Filters = { name?: string };

export function createNameFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters.name;
  if (!filterValue) return;
  return (value: TValue): boolean =>
    value.name.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase());
}
