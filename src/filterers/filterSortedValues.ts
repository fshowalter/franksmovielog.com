// Filter values helper
export function filterSortedValues<TValue>({
  filters,
  sortedValues,
}: {
  filters: ((value: TValue) => boolean)[];
  sortedValues: readonly TValue[];
}): TValue[] {
  return sortedValues.filter((value) => {
    return filters.every((filter) => {
      return filter(value);
    });
  });
}
