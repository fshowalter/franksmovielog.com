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
        { name: "John Ford", sortName: "Ford, John" },
        { name: "John Huston", sortName: "Huston, John" },
        { name: "Howard Hawks", sortName: "Hawks, Howard" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Name (A → Z)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Ford, John")).toBeLessThan(
        text.indexOf("Hawks, Howard"),
      );
      expect(text.indexOf("Hawks, Howard")).toBeLessThan(
        text.indexOf("Huston, John"),
      );
    });

    it("sorts Z → A by  sortName", async ({ expect }) => {
      renderItems([
        { name: "John Ford", sortName: "Ford, John" },
        { name: "John Huston", sortName: "Huston, John" },
        { name: "Howard Hawks", sortName: "Hawks, Howard" },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Name (Z → A)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Huston, John")).toBeLessThan(
        text.indexOf("Hawks, Howard"),
      );
      expect(text.indexOf("Hawks, Howard")).toBeLessThan(
        text.indexOf("Ford, John"),
      );
    });
  });
}
