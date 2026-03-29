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

import type { FilterableValue } from "./performersFilter";

type PerformersFilterItem = FilterableValue & { title: string };

export async function clickPerformerOption(user: UserEvent, value: string) {
  const filter = getAnimatedDetailsDisclosureElement("Performers");
  await clickCheckboxListFieldOption(filter, user, value);
}

/**
 * Shared performers filter facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function performersFilterTests(
  renderItems: (items: PerformersFilterItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("performersFilter", () => {
    it("filters to single performer (OR logic, shows matching, hides others)", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: PerformersFilterItem[] = [
        { title: "Rio Bravo", watchlistPerformerNames: ["John Wayne"] },
        { title: "The Searchers", watchlistPerformerNames: ["John Wayne"] },
        {
          title: "Some Kind of Wonderful",
          watchlistPerformerNames: ["Eric Stoltz"],
        },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickPerformerOption(user, "John Wayne");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Rio Bravo")).toBeInTheDocument();
      expect(within(list).getByText("The Searchers")).toBeInTheDocument();
      expect(
        within(list).queryByText("Some Kind of Wonderful"),
      ).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("filters to multiple performers (OR logic)", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: PerformersFilterItem[] = [
        { title: "Rio Bravo", watchlistPerformerNames: ["John Wayne"] },
        { title: "The Young Lions", watchlistPerformerNames: ["Dean Martin"] },
        {
          title: "Some Kind of Wonderful",
          watchlistPerformerNames: ["Eric Stoltz"],
        },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickPerformerOption(user, "John Wayne");
      await clickPerformerOption(user, "Dean Martin");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Rio Bravo")).toBeInTheDocument();
      expect(within(list).getByText("The Young Lions")).toBeInTheDocument();
      expect(
        within(list).queryByText("Some Kind of Wonderful"),
      ).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("shows performer chip after applying", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: PerformersFilterItem[] = [
        { title: "Rio Bravo", watchlistPerformerNames: ["John Wayne"] },
        {
          title: "Some Kind of Wonderful",
          watchlistPerformerNames: ["Eric Stoltz"],
        },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickPerformerOption(user, "John Wayne");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByLabelText("Remove Performer: John Wayne filter"),
      ).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("removing performer chip defers list update until View Results", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: PerformersFilterItem[] = [
        { title: "Rio Bravo", watchlistPerformerNames: ["John Wayne"] },
        {
          title: "Some Kind of Wonderful",
          watchlistPerformerNames: ["Eric Stoltz"],
        },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickPerformerOption(user, "John Wayne");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Rio Bravo")).toBeInTheDocument();
      expect(
        within(list).queryByText("Some Kind of Wonderful"),
      ).not.toBeInTheDocument();

      // Open filter drawer and click the chip to remove
      await clickToggleFilters(user);
      const chip = screen.getByLabelText("Remove Performer: John Wayne filter");
      await user.click(chip);

      // Before clicking View Results, list should still be filtered
      expect(within(getList()).getByText("Rio Bravo")).toBeInTheDocument();
      expect(
        within(getList()).queryByText("Some Kind of Wonderful"),
      ).not.toBeInTheDocument();

      // Apply the change
      await clickViewResults(user);

      // Now both items should appear
      expect(within(getList()).getByText("Rio Bravo")).toBeInTheDocument();
      expect(
        within(getList()).getByText("Some Kind of Wonderful"),
      ).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });
  });
}
