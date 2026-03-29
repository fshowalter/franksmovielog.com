import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import { getAnimatedDetailsDisclosureElement } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure.testHelper";
import {
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { clickCheckboxListFieldOption } from "~/components/filter-and-sort/fields/CheckboxListField.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type { FilterableValue } from "./collectionsFilter";

type CollectionsFilterItem = FilterableValue & {
  title: string;
};

export async function clickCollectionOption(user: UserEvent, value: string) {
  const filter = getAnimatedDetailsDisclosureElement("Collections");
  await clickCheckboxListFieldOption(filter, user, value);
}

/**
 * Shared collections filter facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function collectionsFilterTests(
  renderItems: (items: CollectionsFilterItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("collectionsFilter", () => {
    it("filters to single collection (OR logic, shows matching, hides others)", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: CollectionsFilterItem[] = [
        { title: "Dracula", watchlistCollectionNames: ["Universal Monsters"] },
        {
          title: "Frankenstein",
          watchlistCollectionNames: ["Universal Monsters"],
        },
        {
          title: "The Curse of Frankenstein",
          watchlistCollectionNames: ["Hammer Horror"],
        },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickCollectionOption(user, "Universal Monsters");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Dracula")).toBeInTheDocument();
      expect(within(list).getByText("Frankenstein")).toBeInTheDocument();
      expect(
        within(list).queryByText("The Curse of Frankenstein"),
      ).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("filters to multiple collections (OR logic)", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: CollectionsFilterItem[] = [
        { title: "Dracula", watchlistCollectionNames: ["Universal Monsters"] },
        {
          title: "The Curse of Frankenstein",
          watchlistCollectionNames: ["Hammer Horror"],
        },
        { title: "Rio Bravo", watchlistCollectionNames: [] },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickCollectionOption(user, "Universal Monsters");
      await clickCollectionOption(user, "Hammer Horror");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Dracula")).toBeInTheDocument();
      expect(
        within(list).getByText("The Curse of Frankenstein"),
      ).toBeInTheDocument();
      expect(within(list).queryByText("Rio Bravo")).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("shows collection chip after applying", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: CollectionsFilterItem[] = [
        { title: "Dracula", watchlistCollectionNames: ["Universal Monsters"] },
        {
          title: "The Curse of Frankenstein",
          watchlistCollectionNames: ["Hammer Horror"],
        },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickCollectionOption(user, "Universal Monsters");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByLabelText("Remove Collection: Universal Monsters filter"),
      ).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("removing collection chip defers list update until View Results", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: CollectionsFilterItem[] = [
        { title: "Dracula", watchlistCollectionNames: ["Universal Monsters"] },
        {
          title: "The Curse of Frankenstein",
          watchlistCollectionNames: ["Hammer Horror"],
        },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickCollectionOption(user, "Universal Monsters");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Dracula")).toBeInTheDocument();
      expect(
        within(list).queryByText("The Curse of Frankenstein"),
      ).not.toBeInTheDocument();

      // Open filter drawer and click the chip to remove
      await clickToggleFilters(user);
      const chip = screen.getByLabelText(
        "Remove Collection: Universal Monsters filter",
      );
      await user.click(chip);

      // Before clicking View Results, list should still be filtered
      expect(within(getList()).getByText("Dracula")).toBeInTheDocument();
      expect(
        within(getList()).queryByText("The Curse of Frankenstein"),
      ).not.toBeInTheDocument();

      // Apply the change
      await clickViewResults(user);

      // Now both items should appear
      expect(within(getList()).getByText("Dracula")).toBeInTheDocument();
      expect(
        within(getList()).getByText("The Curse of Frankenstein"),
      ).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });
  });
}
