import type { ViewingsSort } from "./sortViewings";
import type { ViewingsValue } from "./Viewings";

/**
 * Hook to determine previous, current, and next month dates for calendar navigation.
 * @param filteredValues - Array of filtered viewing values
 * @param sort - Current sort order
 * @param selectedMonthDate - Currently selected month date
 * @returns Tuple of [previousMonthDate, currentMonthDate, nextMonthDate]
 */
export function useMonthNavigation( // eslint-disable-line @eslint-react/no-unnecessary-use-prefix
  filteredValues: ViewingsValue[],
  sort: ViewingsSort,
  selectedMonthDate?: string,
): [string | undefined, string | undefined, string | undefined] {
  "use memo";

  let nextMonthDate;
  let previousMonthDate;
  let currentMonthValue;

  if (filteredValues.length === 0) {
    return [undefined, undefined, undefined];
  }

  selectedMonthDate = selectedMonthDate || filteredValues[0].date;

  const selectedYearAndMonth = selectedMonthDate.slice(0, 7);

  for (const value of filteredValues) {
    if (value.date.startsWith(selectedYearAndMonth)) {
      currentMonthValue = value;
    } else {
      if (sort === "viewing-date-desc") {
        if (currentMonthValue) {
          previousMonthDate = value.date;
          break;
        } else {
          nextMonthDate = value.date;
        }
      }

      if (sort === "viewing-date-asc")
        if (currentMonthValue) {
          nextMonthDate = value.date;
          break;
        } else {
          previousMonthDate = value.date;
        }
    }
  }

  return [previousMonthDate, currentMonthValue?.date, nextMonthDate];
}
