import { screen, within } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import {
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { clickCheckboxListOption } from "~/components/filter-and-sort/fields/CheckboxListField.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

type CollectionsFacetItem = {
  title: string;
  watchlistCollectionNames: string[];
};

/**
 * Shared genre filter facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function collectionsFilterFacetTests(
  renderItems: (items: CollectionsFacetItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("writers filter", () => {
    it("filters to single writer (OR logic, shows matching, hides others)", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: CollectionsFacetItem[] = [
        { genres: ["Horror"], title: "The Exorcist" },
        { genres: ["Horror", "Sci-Fi"], title: "Alien" },
        { genres: ["Action"], title: "Die Hard" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickCheckboxListOption(user, "Genre", "Horror");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("The Exorcist")).toBeInTheDocument();
      expect(within(list).getByText("Alien")).toBeInTheDocument();
      expect(within(list).queryByText("Die Hard")).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("filters to multiple genre (OR logic)", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: CollectionsFacetItem[] = [
        { genres: ["Horror"], title: "The Exorcist" },
        { genres: ["Sci-Fi"], title: "Star Wars" },
        { genres: ["Action"], title: "Die Hard" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickCheckboxListOption(user, "Genre", "Horror");
      await clickCheckboxListOption(user, "Genre", "Sci-Fi");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("The Exorcist")).toBeInTheDocument();
      expect(within(list).getByText("Star Wars")).toBeInTheDocument();
      expect(within(list).queryByText("Die Hard")).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("shows genre chip after applying", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: CollectionsFacetItem[] = [
        { genres: ["Horror"], title: "The Exorcist" },
        { genres: ["Action"], title: "Die Hard" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickCheckboxListOption(user, "Genre", "Horror");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(screen.getByLabelText("Remove Horror filter")).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("removing genre chip defers list update until View Results", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: CollectionsFacetItem[] = [
        { genres: ["Horror"], title: "The Exorcist" },
        { genres: ["Action"], title: "Die Hard" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickCheckboxListOption(user, "Genre", "Horror");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("The Exorcist")).toBeInTheDocument();
      expect(within(list).queryByText("Die Hard")).not.toBeInTheDocument();

      // Open filter drawer and click the chip to remove
      await clickToggleFilters(user);
      const chip = screen.getByLabelText("Remove Horror filter");
      await user.click(chip);

      // Before clicking View Results, list should still be filtered
      expect(within(getList()).getByText("The Exorcist")).toBeInTheDocument();
      expect(within(getList()).queryByText("Die Hard")).not.toBeInTheDocument();

      // Apply the change
      await clickViewResults(user);

      // Now both items should appear
      expect(within(getList()).getByText("The Exorcist")).toBeInTheDocument();
      expect(within(getList()).getByText("Die Hard")).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });
  });
}
