import { describe, it } from "vitest";

import { clickSortOption } from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { SortableByName } from "./nameSort";

type NameSortItem = SortableByName & {
  name: string;
  sortName: string;
};

export function nameSortTests(
  renderItems: (items: NameSortItem[]) => void,
  getList: () => HTMLElement,
) {
  describe("nameSort", () => {
    it("sorts A → Z by sortName", async ({ expect }) => {
      renderItems([
        { name: "John Ford", sortName: "John Ford" },
        { name: "John Huston", sortName: "John Huston" },
        { name: "Howard Hawks", sortName: "Howard Hawks" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Name (A → Z)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Howard Hawks")).toBeLessThan(
        text.indexOf("John Ford"),
      );
      expect(text.indexOf("John Ford")).toBeLessThan(
        text.indexOf("John Huston"),
      );
    });

    it("sorts Z → A by  sortName", async ({ expect }) => {
      renderItems([
        { name: "John Ford", sortName: "John Ford" },
        { name: "John Huston", sortName: "John Huston" },
        { name: "Howard Hawks", sortName: "Howard Hawks" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Name (Z → A)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("John Huston")).toBeLessThan(
        text.indexOf("John Ford"),
      );
      expect(text.indexOf("John Ford")).toBeLessThan(
        text.indexOf("Howard Hawks"),
      );
    });
  });
}
