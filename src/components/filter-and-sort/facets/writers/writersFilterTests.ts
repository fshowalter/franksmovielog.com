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

import type { FilterableValue } from "./writersFilter";

type WritersFacetItem = FilterableValue & { title: string };

/**
 * Shared writers filter facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function writersFilterTests(
  renderItems: (items: WritersFacetItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("writersFilter", () => {
    it("filters to single writer (OR logic, shows matching, hides others)", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: WritersFacetItem[] = [
        { title: "Rio Bravo", watchlistWriterNames: ["Leigh Brackett"] },
        { title: "The Big Sleep", watchlistWriterNames: ["Leigh Brackett"] },
        { title: "The Searchers", watchlistWriterNames: ["Frank S. Nugent"] },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickWriterOption(user, "Leigh Brackett");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Rio Bravo")).toBeInTheDocument();
      expect(within(list).getByText("The Big Sleep")).toBeInTheDocument();
      expect(within(list).queryByText("The Searchers")).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("filters to multiple writers (OR logic)", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: WritersFacetItem[] = [
        { title: "Rio Bravo", watchlistWriterNames: ["Leigh Brackett"] },
        { title: "The Big Sleep", watchlistWriterNames: ["Jules Furthman"] },
        { title: "The Searchers", watchlistWriterNames: ["Frank S. Nugent"] },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickWriterOption(user, "Leigh Brackett");
      await clickWriterOption(user, "Jules Furthman");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Rio Bravo")).toBeInTheDocument();
      expect(within(list).getByText("The Big Sleep")).toBeInTheDocument();
      expect(within(list).queryByText("The Searchers")).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("shows writer chip after applying", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: WritersFacetItem[] = [
        { title: "Rio Bravo", watchlistWriterNames: ["Leigh Brackett"] },
        { title: "The Searchers", watchlistWriterNames: ["Frank S. Nugent"] },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickWriterOption(user, "Leigh Brackett");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByLabelText("Remove Writer: Leigh Brackett filter"),
      ).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("removing writer chip defers list update until View Results", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: WritersFacetItem[] = [
        { title: "Rio Bravo", watchlistWriterNames: ["Leigh Brackett"] },
        { title: "The Searchers", watchlistWriterNames: ["Frank S. Nugent"] },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickWriterOption(user, "Leigh Brackett");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Rio Bravo")).toBeInTheDocument();
      expect(within(list).queryByText("The Searchers")).not.toBeInTheDocument();

      // Open filter drawer and click the chip to remove
      await clickToggleFilters(user);
      const chip = screen.getByLabelText(
        "Remove Writer: Leigh Brackett filter",
      );
      await user.click(chip);

      // Before clicking View Results, list should still be filtered
      expect(within(getList()).getByText("Rio Bravo")).toBeInTheDocument();
      expect(
        within(getList()).queryByText("The Searchers"),
      ).not.toBeInTheDocument();

      // Apply the change
      await clickViewResults(user);

      // Now both items should appear
      expect(within(getList()).getByText("Rio Bravo")).toBeInTheDocument();
      expect(within(getList()).getByText("The Searchers")).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });
  });
}

async function clickWriterOption(user: UserEvent, value: string) {
  const filter = getAnimatedDetailsDisclosureElement("Writers");
  await clickCheckboxListFieldOption(filter, user, value);
}
