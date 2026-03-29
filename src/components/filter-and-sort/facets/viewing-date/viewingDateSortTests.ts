import { describe, it, vi } from "vitest";

import { clickSortOption } from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type { SortableByViewingDate } from "./viewingDateSort";

type ViewingDateItem = SortableByViewingDate & {
  title: string;
};

/**
 * Shared viewing year sort facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function viewingDateFacetTests(
  renderItems: (items: ViewingDateItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("viewingDateSort", () => {
    it("sorts by Viewing Date (Newest First)", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      renderItems([
        { sequence: "1", title: "Movie 1970" },
        { sequence: "3", title: "Movie 2010" },
        { sequence: "2", title: "Movie 1990" },
      ]);

      const user = getUserWithFakeTimers();

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

      renderItems([
        { sequence: "1", title: "Movie 1970" },
        { sequence: "3", title: "Movie 2010" },
        { sequence: "2", title: "Movie 1990" },
      ]);

      const user = getUserWithFakeTimers();

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
