import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import {
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { fillYearField } from "~/components/filter-and-sort/fields/YearField.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { FilterableValue } from "./viewingYearFilter";

type ViewingYearItem = FilterableValue & {
  title: string;
};

/**
 * Shared viewing year filter facet tests.
 * @param adapter - Provides render function, list getter, and distinct viewing years
 */
export function viewingYearFilterTests({
  distinctViewingYears,
  getList,
  renderItems,
}: {
  distinctViewingYears: readonly string[];
  getList: () => HTMLElement;
  renderItems: (items: ViewingYearItem[]) => void;
}): void {
  describe("viewingYearFilter", () => {
    it("filters by viewing year range", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      // Use a sub-range of distinctViewingYears for the test
      const minYear = distinctViewingYears[1] ?? distinctViewingYears[0];
      const maxYear =
        distinctViewingYears.at(-2) ?? distinctViewingYears.at(-1)!;

      const items: ViewingYearItem[] = [
        {
          title: "Oldest Movie",
          viewingYear: distinctViewingYears[0],
        },
        {
          title: "Middle Movie",
          viewingYear: minYear,
        },
        {
          title: "Newest Movie",
          viewingYear: distinctViewingYears.at(-1)!,
        },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillViewingYearFilter(user, minYear, maxYear);
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Middle Movie")).toBeInTheDocument();
      // Oldest movie is in the excluded range (before minYear or at distinctYears[0])
      // Only verify Middle Movie is shown; others depend on specific year values
      expect(within(list).queryByText("Newest Movie")).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("shows viewing year chip after applying filter", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const fromYear = distinctViewingYears[1] ?? distinctViewingYears[0];
      const toYear =
        distinctViewingYears.at(-2) ?? distinctViewingYears.at(-1)!;

      const items: ViewingYearItem[] = [
        {
          title: "Movie A",
          viewingYear: fromYear,
        },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillViewingYearFilter(user, fromYear, toYear);
      await clickViewResults(user);

      await clickToggleFilters(user);
      const expectedLabel =
        fromYear === toYear ? fromYear : `${fromYear} to ${toYear}`;
      expect(
        screen.getByLabelText(`Remove Viewing Year: ${expectedLabel} filter`),
      ).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("removing viewing year chip defers list update until View Results", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const fromYear = distinctViewingYears[1] ?? distinctViewingYears[0];
      const toYear =
        distinctViewingYears.at(-2) ?? distinctViewingYears.at(-1)!;

      const items: ViewingYearItem[] = [
        {
          title: "Excluded Movie",
          viewingYear: distinctViewingYears[0],
        },
        {
          title: "Included Movie",
          viewingYear: fromYear,
        },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillViewingYearFilter(user, fromYear, toYear);
      await clickViewResults(user);

      expect(within(getList()).getByText("Included Movie")).toBeInTheDocument();
      expect(
        within(getList()).queryByText("Excluded Movie"),
      ).not.toBeInTheDocument();

      // Open drawer and click the chip
      await clickToggleFilters(user);
      const expectedLabel =
        fromYear === toYear ? fromYear : `${fromYear} to ${toYear}`;
      const chip = screen.getByLabelText(
        `Remove Viewing Year: ${expectedLabel} filter`,
      );
      await user.click(chip);

      // Before clicking View Results, list should still be filtered
      expect(within(getList()).getByText("Included Movie")).toBeInTheDocument();
      expect(
        within(getList()).queryByText("Excluded Movie"),
      ).not.toBeInTheDocument();

      // Apply the change
      await clickViewResults(user);

      // Now both items should appear
      expect(within(getList()).getByText("Included Movie")).toBeInTheDocument();
      expect(within(getList()).getByText("Excluded Movie")).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });
  });
}

async function fillViewingYearFilter(
  user: UserEvent,
  value1: string,
  value2: string,
) {
  await fillYearField(user, "Viewing Year", value1, value2);
}
