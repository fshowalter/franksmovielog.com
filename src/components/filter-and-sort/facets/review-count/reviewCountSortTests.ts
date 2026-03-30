import { describe, it } from "vitest";

import { clickSortOption } from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { SortableByReviewCount } from "./reviewCountSort";

type ReviewCountSortItem = SortableByReviewCount & {
  name: string;
};

export function reviewCountSortTests(
  renderItems: (items: ReviewCountSortItem[]) => void,
  getList: () => HTMLElement,
) {
  describe("reviewCountSort", () => {
    it("sorts by review count most first", async ({ expect }) => {
      renderItems([
        { name: "John Ford", reviewCount: 5 },
        { name: "Howard Hawks", reviewCount: 15 },
        { name: "Alfred Hitchcock", reviewCount: 10 },
      ]);

      const user = getUserWithFakeTimers();

      await clickSortOption(user, "Review Count (Most First)");

      const avatarList = getList();

      // Check that names appear in descending review count order
      const allText = avatarList.textContent || "";
      const howardIndex = allText.indexOf("Howard Hawks");
      const alfredIndex = allText.indexOf("Alfred Hitchcock");
      const johnIndex = allText.indexOf("John Ford");

      expect(howardIndex).toBeLessThan(alfredIndex);
      expect(alfredIndex).toBeLessThan(johnIndex);
    });

    it("sorts by review count fewest first", async ({ expect }) => {
      renderItems([
        { name: "John Ford", reviewCount: 5 },
        { name: "Howard Hawks", reviewCount: 15 },
        { name: "Alfred Hitchcock", reviewCount: 10 },
      ]);

      const user = getUserWithFakeTimers();

      await clickSortOption(user, "Review Count (Fewest First)");

      const avatarList = getList();

      // Check that names appear in ascending review count order
      const allText = avatarList.textContent || "";
      const johnIndex = allText.indexOf("John Ford");
      const alfredIndex = allText.indexOf("Alfred Hitchcock");
      const howardIndex = allText.indexOf("Howard Hawks");

      expect(johnIndex).toBeLessThan(alfredIndex);
      expect(alfredIndex).toBeLessThan(howardIndex);
    });
  });
}
