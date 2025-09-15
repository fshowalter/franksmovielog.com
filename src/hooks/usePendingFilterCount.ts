import { useState } from "react";

export function usePendingFilterCount<TValue, TFilterValues>(
  filterer: (values: TValue[], filterValues: TFilterValues) => TValue[],
  values: TValue[],
  pendingFilterValues: TFilterValues,
): number {
  const [currentFilterValues, setFilterValues] = useState<TFilterValues>();
  const [pendingFilterCount, setPendingFilterCount] = useState<number>(0);

  if (Object.is(currentFilterValues, pendingFilterValues)) {
    return pendingFilterCount;
  }

  setFilterValues(pendingFilterValues);

  const filteredValues = filterer(values, pendingFilterValues);
  setPendingFilterCount(filteredValues.length);

  return filteredValues.length;
}
