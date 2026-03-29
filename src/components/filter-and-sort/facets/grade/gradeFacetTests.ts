import { screen, within } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import type { GradeText, GradeValue } from "~/utils/grades";

import {
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { fillGradeFilter } from "~/components/filter-and-sort/ReviewedTitleFilters.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

type GradeFacetItem = {
  grade: GradeText | undefined;
  gradeValue: GradeValue | undefined;
  title: string;
};

/**
 * Shared grade filter facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function gradeFilterFacetTests(
  renderItems: (items: GradeFacetItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("grade filter", () => {
    it("filters by grade range B- to A+", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: GradeFacetItem[] = [
        { grade: "D", gradeValue: 6, title: "Bad Movie" },
        { grade: "B-", gradeValue: 11, title: "Decent Movie" },
        { grade: "A+", gradeValue: 16, title: "Great Movie" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillGradeFilter(user, "B-", "A+");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Decent Movie")).toBeInTheDocument();
      expect(within(list).getByText("Great Movie")).toBeInTheDocument();
      expect(within(list).queryByText("Bad Movie")).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("shows grade chip after applying filter", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: GradeFacetItem[] = [
        { grade: "D", gradeValue: 6, title: "Bad Movie" },
        { grade: "A+", gradeValue: 16, title: "Great Movie" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillGradeFilter(user, "B-", "A+");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByLabelText("Remove Grade: B- to A+ filter"),
      ).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("removing grade chip defers list update until View Results", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: GradeFacetItem[] = [
        { grade: "D", gradeValue: 6, title: "Bad Movie" },
        { grade: "A+", gradeValue: 16, title: "Great Movie" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillGradeFilter(user, "B-", "A+");
      await clickViewResults(user);

      expect(within(getList()).getByText("Great Movie")).toBeInTheDocument();
      expect(
        within(getList()).queryByText("Bad Movie"),
      ).not.toBeInTheDocument();

      // Open drawer and click chip
      await clickToggleFilters(user);
      const chip = screen.getByLabelText("Remove Grade: B- to A+ filter");
      await user.click(chip);

      // Before clicking View Results, list should still be filtered
      expect(within(getList()).getByText("Great Movie")).toBeInTheDocument();
      expect(
        within(getList()).queryByText("Bad Movie"),
      ).not.toBeInTheDocument();

      // Apply the change
      await clickViewResults(user);

      // Now both items should appear
      expect(within(getList()).getByText("Great Movie")).toBeInTheDocument();
      expect(within(getList()).getByText("Bad Movie")).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });
  });
}

/**
 * Shared grade sort facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function gradeSortFacetTests(
  renderItems: (items: GradeFacetItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("grade sort", () => {
    it("sorts by Grade (Best First)", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: GradeFacetItem[] = [
        { grade: "B", gradeValue: 12, title: "Good Movie" },
        { grade: "D", gradeValue: 6, title: "Bad Movie" },
        { grade: "A+", gradeValue: 16, title: "Great Movie" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickSortOption(user, "Grade (Best First)");

      const list = getList();
      const allText = list.textContent ?? "";
      expect(allText.indexOf("Great Movie")).toBeLessThan(
        allText.indexOf("Good Movie"),
      );
      expect(allText.indexOf("Good Movie")).toBeLessThan(
        allText.indexOf("Bad Movie"),
      );

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("sorts by Grade (Worst First)", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: GradeFacetItem[] = [
        { grade: "A+", gradeValue: 16, title: "Great Movie" },
        { grade: "B", gradeValue: 12, title: "Good Movie" },
        { grade: "D", gradeValue: 6, title: "Bad Movie" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickSortOption(user, "Grade (Worst First)");

      const list = getList();
      const allText = list.textContent ?? "";
      expect(allText.indexOf("Bad Movie")).toBeLessThan(
        allText.indexOf("Good Movie"),
      );
      expect(allText.indexOf("Good Movie")).toBeLessThan(
        allText.indexOf("Great Movie"),
      );

      vi.clearAllTimers();
      vi.useRealTimers();
    });
  });
}
