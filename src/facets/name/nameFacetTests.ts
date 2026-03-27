import { screen, within } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import {
  fillNameFilter,
  getNameFilter,
} from "~/components/filter-and-sort/CollectionFilters.testHelper";
import {
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

type NameFacetItem = { name: string; sortName: string };

/**
 * Shared name filter facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function nameFilterFacetTests(
  renderItems: (items: NameFacetItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("name filter", () => {
    it("filters to matching names", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: NameFacetItem[] = [
        { name: "Bram Stoker", sortName: "Stoker, Bram" },
        { name: "Mary Shelley", sortName: "Shelley, Mary" },
        { name: "H.G. Wells", sortName: "Wells, H.G." },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillNameFilter(user, "Bram Stoker");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Bram Stoker")).toBeInTheDocument();
      expect(within(list).queryByText("Mary Shelley")).not.toBeInTheDocument();
      expect(within(list).queryByText("H.G. Wells")).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("filters by partial name match", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: NameFacetItem[] = [
        { name: "Bram Stoker", sortName: "Stoker, Bram" },
        { name: "Mary Shelley", sortName: "Shelley, Mary" },
        { name: "H.G. Wells", sortName: "Wells, H.G." },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillNameFilter(user, "Stoker");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Bram Stoker")).toBeInTheDocument();
      expect(within(list).queryByText("Mary Shelley")).not.toBeInTheDocument();
      expect(within(list).queryByText("H.G. Wells")).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("shows search chip after applying name filter", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: NameFacetItem[] = [
        { name: "Bram Stoker", sortName: "Stoker, Bram" },
        { name: "Mary Shelley", sortName: "Shelley, Mary" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillNameFilter(user, "Bram Stoker");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByLabelText("Remove Search: Bram Stoker filter"),
      ).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("removing name chip defers list update until View Results", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: NameFacetItem[] = [
        { name: "Bram Stoker", sortName: "Stoker, Bram" },
        { name: "Mary Shelley", sortName: "Shelley, Mary" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillNameFilter(user, "Bram Stoker");
      await clickViewResults(user);

      expect(within(getList()).getByText("Bram Stoker")).toBeInTheDocument();
      expect(
        within(getList()).queryByText("Mary Shelley"),
      ).not.toBeInTheDocument();

      // Open drawer and click the chip
      await clickToggleFilters(user);
      const chip = screen.getByLabelText("Remove Search: Bram Stoker filter");
      await user.click(chip);

      // Before clicking View Results, list should still be filtered
      expect(within(getList()).getByText("Bram Stoker")).toBeInTheDocument();
      expect(
        within(getList()).queryByText("Mary Shelley"),
      ).not.toBeInTheDocument();

      // Apply the change
      await clickViewResults(user);

      // Now both items should appear
      expect(within(getList()).getByText("Bram Stoker")).toBeInTheDocument();
      expect(within(getList()).getByText("Mary Shelley")).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("resets filter when closing drawer without applying", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: NameFacetItem[] = [
        { name: "Bram Stoker", sortName: "Stoker, Bram" },
        { name: "Mary Shelley", sortName: "Shelley, Mary" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillNameFilter(user, "Bram Stoker");
      await clickViewResults(user);

      expect(within(getList()).getByText("Bram Stoker")).toBeInTheDocument();
      expect(
        within(getList()).queryByText("Mary Shelley"),
      ).not.toBeInTheDocument();

      // Open drawer again and change filter but close without applying
      await clickToggleFilters(user);
      await fillNameFilter(user, "Mary Shelley");
      await clickCloseFilters(user);

      // List should still show Bram Stoker (original filter still active)
      expect(within(getList()).getByText("Bram Stoker")).toBeInTheDocument();
      expect(
        within(getList()).queryByText("Mary Shelley"),
      ).not.toBeInTheDocument();

      // Re-open drawer: filter field should reset to active value
      await clickToggleFilters(user);
      expect(getNameFilter()).toHaveValue("Bram Stoker");

      vi.clearAllTimers();
      vi.useRealTimers();
    });
  });
}

/**
 * Shared name sort facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function nameSortFacetTests(
  renderItems: (items: NameFacetItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("name sort", () => {
    it("sorts A → Z", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: NameFacetItem[] = [
        { name: "Hammer Films", sortName: "Hammer Films" },
        { name: "Blumhouse", sortName: "Blumhouse" },
        { name: "Universal Monsters", sortName: "Universal Monsters" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickSortOption(user, "Name (A → Z)");

      const list = getList();
      const allText = list.textContent ?? "";
      expect(allText.indexOf("Blumhouse")).toBeLessThan(
        allText.indexOf("Hammer Films"),
      );
      expect(allText.indexOf("Hammer Films")).toBeLessThan(
        allText.indexOf("Universal Monsters"),
      );

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("sorts Z → A", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: NameFacetItem[] = [
        { name: "Blumhouse", sortName: "Blumhouse" },
        { name: "Hammer Films", sortName: "Hammer Films" },
        { name: "Universal Monsters", sortName: "Universal Monsters" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickSortOption(user, "Name (Z → A)");

      const list = getList();
      const allText = list.textContent ?? "";
      expect(allText.indexOf("Universal Monsters")).toBeLessThan(
        allText.indexOf("Hammer Films"),
      );
      expect(allText.indexOf("Hammer Films")).toBeLessThan(
        allText.indexOf("Blumhouse"),
      );

      vi.clearAllTimers();
      vi.useRealTimers();
    });
  });
}
