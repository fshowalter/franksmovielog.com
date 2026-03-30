import { describe, it, vi } from "vitest";

import { clickSortOption } from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type { SortableByTitle } from "./titleSort";

type TitleSortItem = SortableByTitle & { title: string };

/**
 * Shared title sort facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function titleSortTests(
  renderItems: (items: TitleSortItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("title sort", () => {
    it("sorts A → Z", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: TitleSortItem[] = [
        { sortTitle: "Zodiac", title: "Zodiac" },
        { sortTitle: "Alien", title: "Alien" },
        { sortTitle: "The Matrix", title: "The Matrix" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickSortOption(user, "Title (A → Z)");

      const list = getList();
      const allText = list.textContent ?? "";
      expect(allText.indexOf("Alien")).toBeLessThan(
        allText.indexOf("The Matrix"),
      );
      expect(allText.indexOf("The Matrix")).toBeLessThan(
        allText.indexOf("Zodiac"),
      );

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("sorts Z → A", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: TitleSortItem[] = [
        { sortTitle: "Alien", title: "Alien" },
        { sortTitle: "The Matrix", title: "The Matrix" },
        { sortTitle: "Zodiac", title: "Zodiac" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickSortOption(user, "Title (Z → A)");

      const list = getList();
      const allText = list.textContent ?? "";
      expect(allText.indexOf("Zodiac")).toBeLessThan(
        allText.indexOf("The Matrix"),
      );
      expect(allText.indexOf("The Matrix")).toBeLessThan(
        allText.indexOf("Alien"),
      );

      vi.clearAllTimers();
      vi.useRealTimers();
    });
  });
}
