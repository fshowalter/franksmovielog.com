import { screen, within } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import {
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { fillViewingYearFilter } from "~/components/filter-and-sort/TitleFilters.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

type ViewingYearFacetAdapter = {
  distinctViewingYears: readonly string[];
  getList: () => HTMLElement;
  renderItems: (items: ViewingYearItem[]) => void;
};

type ViewingYearItem = {
  title: string;
  viewingSequence: number;
  viewingYear: string;
};

/**
 * Shared viewing year filter facet tests.
 * @param adapter - Provides render function, list getter, and distinct viewing years
 */
export function viewingYearFilterFacetTests(
  adapter: ViewingYearFacetAdapter,
): void {
  const { distinctViewingYears, getList, renderItems } = adapter;

  describe("viewing year filter", () => {
    it("filters by viewing year range", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      // Use a sub-range of distinctViewingYears for the test
      const minYear = distinctViewingYears[1] ?? distinctViewingYears[0];
      const maxYear =
        distinctViewingYears.at(-2) ?? distinctViewingYears.at(-1)!;

      const items: ViewingYearItem[] = [
        {
          title: "Oldest Movie",
          viewingSequence: 1,
          viewingYear: distinctViewingYears[0],
        },
        {
          title: "Middle Movie",
          viewingSequence: 2,
          viewingYear: minYear,
        },
        {
          title: "Newest Movie",
          viewingSequence: 3,
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
          viewingSequence: 1,
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
          viewingSequence: 1,
          viewingYear: distinctViewingYears[0],
        },
        {
          title: "Included Movie",
          viewingSequence: 2,
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

/**
 * Shared viewing year sort facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function viewingYearSortFacetTests(
  renderItems: (items: ViewingYearItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("viewing year sort", () => {
    it("sorts by Viewing Date (Newest First)", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: ViewingYearItem[] = [
        { title: "Movie 1970", viewingSequence: 1, viewingYear: "1970" },
        { title: "Movie 2010", viewingSequence: 3, viewingYear: "2010" },
        { title: "Movie 1990", viewingSequence: 2, viewingYear: "1990" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickSortOption(user, "Viewing Date (Newest First)");

      const list = getList();
      const allText = list.textContent ?? "";
      expect(allText.indexOf("Movie 2010")).toBeLessThan(
        allText.indexOf("Movie 1990"),
      );
      expect(allText.indexOf("Movie 1990")).toBeLessThan(
        allText.indexOf("Movie 1970"),
      );

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("sorts by Viewing Date (Oldest First)", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: ViewingYearItem[] = [
        { title: "Movie 2010", viewingSequence: 3, viewingYear: "2010" },
        { title: "Movie 1970", viewingSequence: 1, viewingYear: "1970" },
        { title: "Movie 1990", viewingSequence: 2, viewingYear: "1990" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickSortOption(user, "Viewing Date (Oldest First)");

      const list = getList();
      const allText = list.textContent ?? "";
      expect(allText.indexOf("Movie 1970")).toBeLessThan(
        allText.indexOf("Movie 1990"),
      );
      expect(allText.indexOf("Movie 1990")).toBeLessThan(
        allText.indexOf("Movie 2010"),
      );

      vi.clearAllTimers();
      vi.useRealTimers();
    });
  });
}
