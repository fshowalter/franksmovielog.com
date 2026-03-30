export type FilterableValue = { title: string };
type Filters = { title?: string };

export function createTitleFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters.title;
  if (!filterValue) return;
  return (value: TValue): boolean =>
    value.title.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase());
}
