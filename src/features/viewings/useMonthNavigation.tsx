import type { ViewingsSort } from "./sortViewings";
import type { ViewingsValue } from "./Viewings";

export function useMonthNavigation(
  filteredValues: ViewingsValue[],
  sort: ViewingsSort,
  selectedMonthDate?: string,
): [string | undefined, string | undefined, string | undefined] {
  let nextMonthDate;
  let previousMonthDate;
  let currentMonthValue;

  if (filteredValues.length === 0) {
    return [undefined, undefined, undefined];
  }

  selectedMonthDate = selectedMonthDate || filteredValues[0].viewingDate;

  const selectedYearAndMonth = selectedMonthDate.slice(0, 7);

  for (const value of filteredValues) {
    if (value.viewingDate.startsWith(selectedYearAndMonth)) {
      currentMonthValue = value;
    } else {
      if (sort === "viewing-date-desc") {
        if (currentMonthValue) {
          previousMonthDate = value.viewingDate;
          break;
        } else {
          nextMonthDate = value.viewingDate;
        }
      }

      if (sort === "viewing-date-asc")
        if (currentMonthValue) {
          nextMonthDate = value.viewingDate;
          break;
        } else {
          previousMonthDate = value.viewingDate;
        }
    }
  }

  return [previousMonthDate, currentMonthValue?.viewingDate, nextMonthDate];
}
