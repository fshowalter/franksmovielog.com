import { describe, it, vi } from "vitest";

import { clickSortOption } from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { SortableByGrade } from "./gradeSort";

type GradeSortItem = SortableByGrade & {
  title: string;
};

/**
 * Shared grade sort facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function gradeSortTests(
  renderItems: (items: GradeSortItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("gradeSort", () => {
    it("sorts by Grade (Best First)", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: GradeSortItem[] = [
        { gradeValue: 12, title: "Good Movie" },
        { gradeValue: 6, title: "Bad Movie" },
        { gradeValue: 16, title: "Great Movie" },
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

      const items: GradeSortItem[] = [
        { gradeValue: 16, title: "Great Movie" },
        { gradeValue: 12, title: "Good Movie" },
        { gradeValue: 6, title: "Bad Movie" },
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
