import { describe, it, vi } from "vitest";

import { clickSortOption } from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { SortableByReleaseDate } from "./releaseDateSort";

type ReleaseDateSortItem = SortableByReleaseDate & {
  title: string;
};

/**
 * Shared release date sort facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function releaseDateSortTests(
  renderItems: (items: ReleaseDateSortItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("releaseDateSort", () => {
    it("sorts by Release Date (Newest First)", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const user = getUserWithFakeTimers();
      renderItems([
        { releaseSequence: 1, title: "Movie 1970" },
        { releaseSequence: 3, title: "Movie 2010" },
        { releaseSequence: 2, title: "Movie 1990" },
      ]);

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

      const user = getUserWithFakeTimers();
      renderItems([
        { releaseSequence: 3, title: "Movie 2010" },
        { releaseSequence: 1, title: "Movie 1970" },
        { releaseSequence: 2, title: "Movie 1990" },
      ]);

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
