import { screen, within } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import {
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import { fillReviewYearFilter } from "~/components/filter-and-sort/ReviewedTitleFilters.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

type ReviewYearFacetAdapter = {
  distinctReviewYears: readonly string[];
  getList: () => HTMLElement;
  renderItems: (items: ReviewYearItem[]) => void;
};

type ReviewYearItem = {
  reviewSequence: string;
  reviewYear: string;
  title: string;
};

/**
 * Shared review year filter facet tests.
 * @param adapter - Provides render function, list getter, and distinct review years
 */
export function reviewYearFilterFacetTests(
  adapter: ReviewYearFacetAdapter,
): void {
  const { distinctReviewYears, getList, renderItems } = adapter;

  describe("review year filter", () => {
    it("filters by review year range", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const fromYear = distinctReviewYears[1] ?? distinctReviewYears[0];
      const toYear = distinctReviewYears.at(-2) ?? distinctReviewYears.at(-1)!;

      const items: ReviewYearItem[] = [
        {
          reviewSequence: "1",
          reviewYear: distinctReviewYears[0],
          title: "Oldest Review",
        },
        {
          reviewSequence: "2",
          reviewYear: fromYear,
          title: "Middle Review",
        },
        {
          reviewSequence: "3",
          reviewYear: distinctReviewYears.at(-1)!,
          title: "Newest Review",
        },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillReviewYearFilter(user, fromYear, toYear);
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Middle Review")).toBeInTheDocument();
      expect(within(list).queryByText("Newest Review")).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("shows review year chip after applying filter", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const fromYear = distinctReviewYears[1] ?? distinctReviewYears[0];
      const toYear = distinctReviewYears.at(-2) ?? distinctReviewYears.at(-1)!;

      const items: ReviewYearItem[] = [
        {
          reviewSequence: "1",
          reviewYear: fromYear,
          title: "Movie A",
        },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillReviewYearFilter(user, fromYear, toYear);
      await clickViewResults(user);

      await clickToggleFilters(user);
      const expectedLabel =
        fromYear === toYear ? fromYear : `${fromYear} to ${toYear}`;
      expect(
        screen.getByLabelText(`Remove Review Year: ${expectedLabel} filter`),
      ).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("removing review year chip defers list update until View Results", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const fromYear = distinctReviewYears[1] ?? distinctReviewYears[0];
      const toYear = distinctReviewYears.at(-2) ?? distinctReviewYears.at(-1)!;

      const items: ReviewYearItem[] = [
        {
          reviewSequence: "1",
          reviewYear: distinctReviewYears[0],
          title: "Excluded Review",
        },
        {
          reviewSequence: "2",
          reviewYear: fromYear,
          title: "Included Review",
        },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillReviewYearFilter(user, fromYear, toYear);
      await clickViewResults(user);

      expect(
        within(getList()).getByText("Included Review"),
      ).toBeInTheDocument();
      expect(
        within(getList()).queryByText("Excluded Review"),
      ).not.toBeInTheDocument();

      // Open drawer and click the chip
      await clickToggleFilters(user);
      const expectedLabel =
        fromYear === toYear ? fromYear : `${fromYear} to ${toYear}`;
      const chip = screen.getByLabelText(
        `Remove Review Year: ${expectedLabel} filter`,
      );
      await user.click(chip);

      // Before clicking View Results, list should still be filtered
      expect(
        within(getList()).getByText("Included Review"),
      ).toBeInTheDocument();
      expect(
        within(getList()).queryByText("Excluded Review"),
      ).not.toBeInTheDocument();

      // Apply the change
      await clickViewResults(user);

      // Now both items should appear
      expect(
        within(getList()).getByText("Included Review"),
      ).toBeInTheDocument();
      expect(
        within(getList()).getByText("Excluded Review"),
      ).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });
  });
}

/**
 * Shared review year sort facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function reviewYearSortFacetTests(
  renderItems: (items: ReviewYearItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("review year sort", () => {
    it("sorts by Review Date (Newest First)", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: ReviewYearItem[] = [
        { reviewSequence: "1", reviewYear: "2019", title: "Review 2019" },
        { reviewSequence: "3", reviewYear: "2023", title: "Review 2023" },
        { reviewSequence: "2", reviewYear: "2021", title: "Review 2021" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickSortOption(user, "Review Date (Newest First)");

      const list = getList();
      const allText = list.textContent ?? "";
      expect(allText.indexOf("Review 2023")).toBeLessThan(
        allText.indexOf("Review 2021"),
      );
      expect(allText.indexOf("Review 2021")).toBeLessThan(
        allText.indexOf("Review 2019"),
      );

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("sorts by Review Date (Oldest First)", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: ReviewYearItem[] = [
        { reviewSequence: "3", reviewYear: "2023", title: "Review 2023" },
        { reviewSequence: "1", reviewYear: "2019", title: "Review 2019" },
        { reviewSequence: "2", reviewYear: "2021", title: "Review 2021" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickSortOption(user, "Review Date (Oldest First)");

      const list = getList();
      const allText = list.textContent ?? "";
      expect(allText.indexOf("Review 2019")).toBeLessThan(
        allText.indexOf("Review 2021"),
      );
      expect(allText.indexOf("Review 2021")).toBeLessThan(
        allText.indexOf("Review 2023"),
      );

      vi.clearAllTimers();
      vi.useRealTimers();
    });
  });
}
