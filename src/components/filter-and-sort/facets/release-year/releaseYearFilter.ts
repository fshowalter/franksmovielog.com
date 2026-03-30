import { STATE_KEY } from "./releaseYearReducer";

export type FilterableValue = { releaseYear: string };
type Filters = { [STATE_KEY]?: [string, string] };

export function createReleaseYearFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters[STATE_KEY];
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.releaseYear >= filterValue[0] && value.releaseYear <= filterValue[1]
    );
  };
}
