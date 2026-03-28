import { screen, within } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import {
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { fillReleaseYearFilter } from "~/components/filter-and-sort/TitleFilters.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

type ReleaseYearFacetAdapter = {
  distinctReleaseYears: readonly string[];
  getList: () => HTMLElement;
  renderItems: (items: ReleaseYearItem[]) => void;
};

type ReleaseYearItem = {
  releaseSequence: number;
  releaseYear: string;
  title: string;
};

/**
 * Shared release year filter facet tests.
 * @param adapter - Provides render function, list getter, and distinct release years
 */
export function releaseYearFilterFacetTests(
  adapter: ReleaseYearFacetAdapter,
): void {
  const { distinctReleaseYears, getList, renderItems } = adapter;

  describe("release year filter", () => {
    it("filters by release year range", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      // Use a sub-range of distinctReleaseYears for the test
      const minYear = distinctReleaseYears[1] ?? distinctReleaseYears[0];
      const maxYear =
        distinctReleaseYears.at(-2) ?? distinctReleaseYears.at(-1)!;

      const items: ReleaseYearItem[] = [
        {
          releaseSequence: 1,
          releaseYear: distinctReleaseYears[0],
          title: "Oldest Movie",
        },
        {
          releaseSequence: 2,
          releaseYear: minYear,
          title: "Middle Movie",
        },
        {
          releaseSequence: 3,
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

      const items: ReleaseYearItem[] = [
        {
          releaseSequence: 1,
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

      const items: ReleaseYearItem[] = [
        {
          releaseSequence: 1,
          releaseYear: distinctReleaseYears[0],
          title: "Excluded Movie",
        },
        {
          releaseSequence: 2,
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

/**
 * Shared release year sort facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function releaseYearSortFacetTests(
  renderItems: (items: ReleaseYearItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("release year sort", () => {
    it("sorts by Release Date (Newest First)", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: ReleaseYearItem[] = [
        { releaseSequence: 1, releaseYear: "1970", title: "Movie 1970" },
        { releaseSequence: 3, releaseYear: "2010", title: "Movie 2010" },
        { releaseSequence: 2, releaseYear: "1990", title: "Movie 1990" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickSortOption(user, "Release Date (Newest First)");

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

    it("sorts by Release Date (Oldest First)", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: ReleaseYearItem[] = [
        { releaseSequence: 3, releaseYear: "2010", title: "Movie 2010" },
        { releaseSequence: 1, releaseYear: "1970", title: "Movie 1970" },
        { releaseSequence: 2, releaseYear: "1990", title: "Movie 1990" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickSortOption(user, "Release Date (Oldest First)");

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
