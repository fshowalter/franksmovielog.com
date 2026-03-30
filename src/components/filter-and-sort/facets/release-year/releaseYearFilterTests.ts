import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import {
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { fillYearField } from "~/components/filter-and-sort/fields/YearField.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type { FilterableValue } from "./releaseYearFilter";

type ReleaseYearFilterItem = FilterableValue & {
  title: string;
};

/**
 * Shared release year filter facet tests.
 * @param adapter - Provides render function, list getter, and distinct release years
 */
export function releaseYearFilterTests({
  distinctReleaseYears,
  getList,
  renderItems,
}: {
  distinctReleaseYears: readonly string[];
  getList: () => HTMLElement;
  renderItems: (items: ReleaseYearFilterItem[]) => void;
}): void {
  describe("releaseYearFilter", () => {
    it("filters by release year range", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      // Use a sub-range of distinctReleaseYears for the test
      const minYear = distinctReleaseYears[1] ?? distinctReleaseYears[0];
      const maxYear =
        distinctReleaseYears.at(-2) ?? distinctReleaseYears.at(-1)!;

      const items: ReleaseYearFilterItem[] = [
        {
          releaseYear: distinctReleaseYears[0],
          title: "Oldest Movie",
        },
        {
          releaseYear: minYear,
          title: "Middle Movie",
        },
        {
          releaseYear: distinctReleaseYears.at(-1)!,
          title: "Newest Movie",
        },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillReleaseYearFilter(user, minYear, maxYear);
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Middle Movie")).toBeInTheDocument();
      // Oldest movie is in the excluded range (before minYear or at distinctYears[0])
      // Only verify Middle Movie is shown; others depend on specific year values
      expect(within(list).queryByText("Newest Movie")).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("shows release year chip after applying filter", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const fromYear = distinctReleaseYears[1] ?? distinctReleaseYears[0];
      const toYear =
        distinctReleaseYears.at(-2) ?? distinctReleaseYears.at(-1)!;

      const items: ReleaseYearFilterItem[] = [
        {
          releaseYear: fromYear,
          title: "Movie A",
        },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillReleaseYearFilter(user, fromYear, toYear);
      await clickViewResults(user);

      await clickToggleFilters(user);
      const expectedLabel =
        fromYear === toYear ? fromYear : `${fromYear} to ${toYear}`;
      expect(
        screen.getByLabelText(`Remove Release Year: ${expectedLabel} filter`),
      ).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("removing release year chip defers list update until View Results", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const fromYear = distinctReleaseYears[1] ?? distinctReleaseYears[0];
      const toYear =
        distinctReleaseYears.at(-2) ?? distinctReleaseYears.at(-1)!;

      const items: ReleaseYearFilterItem[] = [
        {
          releaseYear: distinctReleaseYears[0],
          title: "Excluded Movie",
        },
        {
          releaseYear: fromYear,
          title: "Included Movie",
        },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillReleaseYearFilter(user, fromYear, toYear);
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
        `Remove Release Year: ${expectedLabel} filter`,
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

async function fillReleaseYearFilter(
  user: UserEvent,
  value1: string,
  value2: string,
) {
  await fillYearField(user, "Release Year", value1, value2);
}
