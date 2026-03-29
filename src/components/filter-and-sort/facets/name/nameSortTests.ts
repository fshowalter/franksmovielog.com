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
        {
          name: "Zelda Fitzgerald",
          sortName: "Fitzgerald, Zelda",
        },
        {
          name: "Arthur Conan Doyle",
          sortName: "Doyle, Arthur Conan",
        },
        {
          name: "Mary Shelley",
          sortName: "Shelley, Mary",
        },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Name (A → Z)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Doyle, Arthur Conan")).toBeLessThan(
        text.indexOf("Fitzgerald, Zelda"),
      );
      expect(text.indexOf("Fitzgerald, Zelda")).toBeLessThan(
        text.indexOf("Shelley, Mary"),
      );
    });

    it("sorts Z → A by  sortName", async ({ expect }) => {
      renderItems([
        {
          name: "Arthur Conan Doyle",
          sortName: "Doyle, Arthur Conan",
        },
        {
          name: "Zelda Fitzgerald",
          sortName: "Fitzgerald, Zelda",
        },
        {
          name: "Mary Shelley",
          sortName: "Shelley, Mary",
        },
      ]);

      const user = getUserWithFakeTimers();
      await clickSortOption(user, "Name (Z → A)");

      const list = getList();
      const text = list.textContent ?? "";
      expect(text.indexOf("Shelley, Mary")).toBeLessThan(
        text.indexOf("Fitzgerald, Zelda"),
      );
      expect(text.indexOf("Fitzgerald, Zelda")).toBeLessThan(
        text.indexOf("Doyle, Arthur Conan"),
      );
    });
  });
}
