/**
 * Applies the given filter to the given collection of T.
 */
export default function applyFilters<T>({
  collection,
  filters,
}: {
  /** The collection to filter. */
  collection: T[];
  /** The filters to apply. */
  filters: Record<string, (arg0: T) => boolean>;
}): T[] {
  return collection.filter((item) => {
    return Object.values(filters).every((filter) => {
      return filter(item);
    });
  });
}
