import { screen, within } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import { getAnimatedDetailsDisclosureElement } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure.testHelper";
import {
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { clickCheckboxListFieldOption } from "~/components/filter-and-sort/fields/CheckboxListField.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type { FilterableValue } from "./creditedAsFilter";

type CreditedAsFilterItem = FilterableValue & { title: string };

/**
 * Shared genre filter facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function creditedAsFilterTests(
  renderItems: (items: CreditedAsFilterItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("creditedAsFilter", () => {
    it("filters to single credit (OR logic, shows matching, hides others)", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: CreditedAsFilterItem[] = [
        { creditedAs: ["director"], title: "The Exorcist" },
        { creditedAs: ["director", "writer"], title: "Alien" },
        { creditedAs: ["performer"], title: "Die Hard" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickCreditedAsOption(user, "Director");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("The Exorcist")).toBeInTheDocument();
      expect(within(list).getByText("Alien")).toBeInTheDocument();
      expect(within(list).queryByText("Die Hard")).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("filters to multiple credits (OR logic)", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: CreditedAsFilterItem[] = [
        { creditedAs: ["director"], title: "The Exorcist" },
        { creditedAs: ["writer"], title: "Star Wars" },
        { creditedAs: ["performer"], title: "Die Hard" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickCreditedAsOption(user, "Director");
      await clickCreditedAsOption(user, "Writer");
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

      const items: CreditedAsFilterItem[] = [
        { creditedAs: ["director"], title: "The Exorcist" },
        { creditedAs: ["writer"], title: "Die Hard" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickCreditedAsOption(user, "Director");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByLabelText("Remove Director filter"),
      ).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("removing genre chip defers list update until View Results", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      const items: CreditedAsFilterItem[] = [
        { creditedAs: ["director"], title: "The Exorcist" },
        { creditedAs: ["writer"], title: "Die Hard" },
      ];

      const user = getUserWithFakeTimers();
      renderItems(items);

      await clickToggleFilters(user);
      await clickCreditedAsOption(user, "Director");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("The Exorcist")).toBeInTheDocument();
      expect(within(list).queryByText("Die Hard")).not.toBeInTheDocument();

      // Open filter drawer and click the chip to remove
      await clickToggleFilters(user);
      const chip = screen.getByLabelText("Remove Director filter");
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

async function clickCreditedAsOption(
  user: Parameters<typeof clickCheckboxListFieldOption>[1],
  value: string,
) {
  const filter = getAnimatedDetailsDisclosureElement("Credited As");
  await clickCheckboxListFieldOption(filter, user, value);
}
