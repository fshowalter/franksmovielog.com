import type { ViewingsSort } from "./sortViewings";
import type { ViewingsValue } from "./Viewings";

export function useMonthNavigation(
  currentMonth: {
    month: string;
    year: string;
  },
  filteredValues: ViewingsValue[],
  sort: ViewingsSort,
): [
  undefined | ViewingsValue,
  undefined | ViewingsValue,
  undefined | ViewingsValue,
] {
  let nextMonthValue;
  let previousMonthValue;
  let currentMonthValue;

  for (const value of filteredValues) {
    if (
      value.viewingMonthShort === currentMonth.month &&
      value.viewingYear == currentMonth.year
    ) {
      currentMonthValue = value;
    } else {
      if (sort === "viewing-date-desc") {
        if (currentMonthValue) {
          previousMonthValue = value;
          break;
        } else {
          nextMonthValue = value;
        }
      }

      if (sort === "viewing-date-asc")
        if (currentMonthValue) {
          nextMonthValue = value;
          break;
        } else {
          previousMonthValue = value;
        }
    }
  }

  return [previousMonthValue, currentMonthValue, nextMonthValue];
}
