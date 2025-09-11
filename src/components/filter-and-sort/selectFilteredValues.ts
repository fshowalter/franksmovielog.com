/**
 * Filter values helper - filters items based on multiple filter functions
 */
export function selectFilteredValues<TValue>(
  filters: Record<string, (value: TValue) => boolean>,
  values: readonly TValue[],
): TValue[] {
  return values.filter((item) => {
    return Object.values(filters).every((filter) => {
      return filter(item);
    });
  });
}
