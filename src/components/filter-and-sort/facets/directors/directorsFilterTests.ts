import { screen, within } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import { getAnimatedDetailsDisclosureElement } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure.testHelper";
import {
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { clickCheckboxListFieldOption } from "~/components/filter-and-sort/fields/CheckboxListField.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { FilterableValue } from "./directorsFilter";

type DirectorsFilterItem = FilterableValue & { title: string };

/**
 * Shared directors filter facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function directorsFilterTests(
  renderItems: (items: DirectorsFilterItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("directorsFilter", () => {
    it("filters to single director (OR logic, shows matching, hides others)", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: DirectorsFilterItem[] = [
        { title: "Rio Bravo", watchlistDirectorNames: ["Howard Hawks"] },
        { title: "Red River", watchlistDirectorNames: ["Howard Hawks"] },
        { title: "The Searchers", watchlistDirectorNames: ["John Ford"] },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickDirectorOption(user, "Howard Hawks");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Rio Bravo")).toBeInTheDocument();
      expect(within(list).getByText("Red River")).toBeInTheDocument();
      expect(within(list).queryByText("The Searchers")).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("filters to multiple directors (OR logic)", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: DirectorsFilterItem[] = [
        { title: "Rio Bravo", watchlistDirectorNames: ["Howard Hawks"] },
        { title: "The Thing", watchlistDirectorNames: ["John Carpenter"] },
        { title: "Stagecoach", watchlistDirectorNames: ["John Ford"] },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickDirectorOption(user, "Howard Hawks");
      await clickDirectorOption(user, "John Carpenter");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Rio Bravo")).toBeInTheDocument();
      expect(within(list).getByText("The Thing")).toBeInTheDocument();
      expect(within(list).queryByText("Stagecoach")).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("shows director chip after applying", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: DirectorsFilterItem[] = [
        { title: "Rio Bravo", watchlistDirectorNames: ["Howard Hawks"] },
        { title: "Stagecoach", watchlistDirectorNames: ["John Ford"] },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickDirectorOption(user, "Howard Hawks");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByLabelText("Remove Director: Howard Hawks filter"),
      ).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("removing director chip defers list update until View Results", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: DirectorsFilterItem[] = [
        { title: "Rio Bravo", watchlistDirectorNames: ["Howard Hawks"] },
        { title: "Stagecoach", watchlistDirectorNames: ["John Ford"] },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickDirectorOption(user, "Howard Hawks");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Rio Bravo")).toBeInTheDocument();
      expect(within(list).queryByText("Stagecoach")).not.toBeInTheDocument();

      // Open filter drawer and click the chip to remove
      await clickToggleFilters(user);
      const chip = screen.getByLabelText(
        "Remove Director: Howard Hawks filter",
      );
      await user.click(chip);

      // Before clicking View Results, list should still be filtered
      expect(within(getList()).getByText("Rio Bravo")).toBeInTheDocument();
      expect(
        within(getList()).queryByText("Stagecoach"),
      ).not.toBeInTheDocument();

      // Apply the change
      await clickViewResults(user);

      // Now both items should appear
      expect(within(getList()).getByText("Rio Bravo")).toBeInTheDocument();
      expect(within(getList()).getByText("Stagecoach")).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });
  });
}

async function clickDirectorOption(
  user: Parameters<typeof clickCheckboxListFieldOption>[1],
  value: string,
) {
  const filter = getAnimatedDetailsDisclosureElement("Directors");
  await clickCheckboxListFieldOption(filter, user, value);
}
