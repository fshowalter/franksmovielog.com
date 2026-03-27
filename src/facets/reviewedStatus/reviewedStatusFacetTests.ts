import { screen, within } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import {
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import { clickReviewedStatusFilterOption } from "~/components/filter-and-sort/ReviewedStatusFilter.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

// AIDEV-NOTE: Items with gradeValue > 0 are "Reviewed"; items without grade are "Not Reviewed"
type ReviewedStatusFacetItem = {
  grade?: string;
  gradeValue?: number;
  title: string;
};

/**
 * Shared reviewed status filter facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function reviewedStatusFilterFacetTests(
  renderItems: (items: ReviewedStatusFacetItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("reviewed status filter", () => {
    it("filters to Reviewed items only", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: ReviewedStatusFacetItem[] = [
        { grade: "A", gradeValue: 15, title: "Reviewed Movie" },
        { title: "Not Reviewed Movie" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickReviewedStatusFilterOption(user, "Reviewed");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Reviewed Movie")).toBeInTheDocument();
      expect(
        within(list).queryByText("Not Reviewed Movie"),
      ).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("filters to Not Reviewed items only", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: ReviewedStatusFacetItem[] = [
        { grade: "A", gradeValue: 15, title: "Reviewed Movie" },
        { title: "Not Reviewed Movie" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickReviewedStatusFilterOption(user, "Not Reviewed");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Not Reviewed Movie")).toBeInTheDocument();
      expect(
        within(list).queryByText("Reviewed Movie"),
      ).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("shows reviewed status chip after applying", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: ReviewedStatusFacetItem[] = [
        { grade: "A", gradeValue: 15, title: "Reviewed Movie" },
        { title: "Not Reviewed Movie" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickReviewedStatusFilterOption(user, "Reviewed");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByLabelText("Remove Reviewed filter"),
      ).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("removing reviewed status chip defers list update until View Results", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: ReviewedStatusFacetItem[] = [
        { grade: "A", gradeValue: 15, title: "Reviewed Movie" },
        { title: "Not Reviewed Movie" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickReviewedStatusFilterOption(user, "Reviewed");
      await clickViewResults(user);

      expect(
        within(getList()).getByText("Reviewed Movie"),
      ).toBeInTheDocument();
      expect(
        within(getList()).queryByText("Not Reviewed Movie"),
      ).not.toBeInTheDocument();

      // Open drawer and click the chip
      await clickToggleFilters(user);
      const chip = screen.getByLabelText("Remove Reviewed filter");
      await user.click(chip);

      // Before clicking View Results, list should still be filtered
      expect(
        within(getList()).getByText("Reviewed Movie"),
      ).toBeInTheDocument();
      expect(
        within(getList()).queryByText("Not Reviewed Movie"),
      ).not.toBeInTheDocument();

      // Apply the change
      await clickViewResults(user);

      // Now both items should appear
      expect(
        within(getList()).getByText("Reviewed Movie"),
      ).toBeInTheDocument();
      expect(
        within(getList()).getByText("Not Reviewed Movie"),
      ).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });
  });
}
