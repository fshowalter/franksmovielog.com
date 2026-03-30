import { describe, it } from "vitest";

import { clickSortOption } from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type { SortableByViewingDate } from "./viewingDateSort";

type ViewingDateItem = SortableByViewingDate & {
  date: string;
  title: string;
};

/**
 * Shared viewing year sort facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function viewingDateFacetTests(
  renderItems: (items: ViewingDateItem[]) => void,
  getCalendar: () => HTMLElement,
): void {
  describe("viewingDateSort", () => {
    it("sorts by viewing date newest first", async ({ expect }) => {
      renderItems([
        {
          date: "2007-04-01",
          sequence: "1",
          title: "Old Viewing",
        },
        {
          date: "2007-04-03",
          sequence: "3",
          title: "New Viewing",
        },
        {
          date: "2007-04-02",
          sequence: "2",
          title: "Mid Viewing",
        },
      ]);

      const calendar = getCalendar();

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Viewing Date (Newest First)");

      const movies = ["New Viewing", "Mid Viewing", "Old Viewing"];
      const foundMovies = movies.filter((movie) =>
        calendar.textContent?.includes(movie),
      );

      expect(foundMovies).toHaveLength(3);

      // Verify they're in the right order by checking their position in the calendar
      const allText = calendar.textContent || "";
      const newIndex = allText.indexOf("3New Viewing"); // Day 3
      const midIndex = allText.indexOf("2Mid Viewing"); // Day 2
      const oldIndex = allText.indexOf("1Old Viewing"); // Day 1

      expect(oldIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(newIndex);
    });

    it("sorts by viewing date oldest first", async ({ expect }) => {
      renderItems([
        {
          date: "2007-04-01",
          sequence: "1",
          title: "Old Viewing",
        },
        {
          date: "2007-04-03",
          sequence: "3",
          title: "New Viewing",
        },
        {
          date: "2007-04-02",
          sequence: "2",
          title: "Mid Viewing",
        },
      ]);

      const user = getUserWithFakeTimers();

      await clickSortOption(user, "Viewing Date (Oldest First)");

      const calendar = getCalendar();
      const allText = calendar.textContent || "";
      const oldIndex = allText.indexOf("Old Viewing");
      const midIndex = allText.indexOf("Mid Viewing");
      const newIndex = allText.indexOf("New Viewing");

      expect(oldIndex).toBeLessThan(midIndex);
      expect(midIndex).toBeLessThan(newIndex);
    });
  });
}
