import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import {
  clickCloseFilters,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { fillTextField } from "~/components/filter-and-sort/fields/TextField.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { FilterableValue } from "./titleFilter";

type TitleFilterItem = FilterableValue;

/**
 * Shared title filter facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function titleFilterTests(
  renderItems: (items: TitleFilterItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("titleFilter", () => {
    it("filters to matching title", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: TitleFilterItem[] = [
        { title: "Dracula" },
        { title: "Frankenstein" },
        { title: "The Mummy" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dracula");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Dracula")).toBeInTheDocument();
      expect(within(list).queryByText("Frankenstein")).not.toBeInTheDocument();
      expect(within(list).queryByText("The Mummy")).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("resets filter when closing drawer without applying", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: TitleFilterItem[] = [
        { title: "Dracula" },
        { title: "Frankenstein" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dracula");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Dracula")).toBeInTheDocument();
      expect(within(list).queryByText("Frankenstein")).not.toBeInTheDocument();

      // Open drawer again and change filter but close without applying
      await clickToggleFilters(user);
      await fillTitleFilter(user, "Frankenstein");
      await clickCloseFilters(user);

      // List should still show Dracula (original filter still active)
      expect(within(getList()).getByText("Dracula")).toBeInTheDocument();
      expect(
        within(getList()).queryByText("Frankenstein"),
      ).not.toBeInTheDocument();

      // Re-open drawer: filter field should reset to active value
      await clickToggleFilters(user);
      expect(getTitleFilter()).toHaveValue("Dracula");

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("shows search chip after applying title filter", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: TitleFilterItem[] = [
        { title: "Dracula" },
        { title: "Frankenstein" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dracula");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByLabelText("Remove Title: Dracula filter"),
      ).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("removing title chip defers list update until View Results", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: TitleFilterItem[] = [
        { title: "Dracula" },
        { title: "Frankenstein" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dracula");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Dracula")).toBeInTheDocument();
      expect(within(list).queryByText("Frankenstein")).not.toBeInTheDocument();

      // Open the filter drawer and click the chip to remove the filter
      await clickToggleFilters(user);
      const chip = screen.getByLabelText("Remove Title: Dracula filter");
      await user.click(chip);

      // Before clicking View Results, the list should still be filtered
      expect(within(getList()).getByText("Dracula")).toBeInTheDocument();
      expect(
        within(getList()).queryByText("Frankenstein"),
      ).not.toBeInTheDocument();

      // Apply the change
      await clickViewResults(user);

      // Now both items should appear
      expect(within(getList()).getByText("Dracula")).toBeInTheDocument();
      expect(within(getList()).getByText("Frankenstein")).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });
  });
}

async function fillTitleFilter(user: UserEvent, value: string) {
  await fillTextField(user, "Title", value);
}

function getTitleFilter() {
  return screen.getByLabelText("Title");
}
