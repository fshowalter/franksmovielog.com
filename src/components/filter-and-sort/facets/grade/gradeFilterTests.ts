import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import {
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type { FilterableValue } from "./gradeFilter";

type GradeFilterItem = FilterableValue & {
  title: string;
};

/**
 * Shared grade filter facet tests.
 * @param renderItems - Renders the feature component with the given items
 * @param getList - Returns the list DOM element to assert against
 */
export function gradeFilterFacetTests(
  renderItems: (items: GradeFilterItem[]) => void,
  getList: () => HTMLElement,
): void {
  describe("gradeFilter", () => {
    it("filters by grade range B- to A+", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      renderItems([
        { gradeValue: 6, title: "Bad Movie" },
        { gradeValue: 11, title: "Decent Movie" },
        { gradeValue: 16, title: "Great Movie" },
      ]);

      const user = getUserWithFakeTimers();

      await clickToggleFilters(user);
      await fillGradeFilter(user, "B-", "A+");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("Decent Movie")).toBeInTheDocument();
      expect(within(list).getByText("Great Movie")).toBeInTheDocument();
      expect(within(list).queryByText("Bad Movie")).not.toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("shows grade chip after applying filter", async ({ expect }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      renderItems([
        { gradeValue: 6, title: "Bad Movie" },
        { gradeValue: 16, title: "Great Movie" },
      ]);

      const user = getUserWithFakeTimers();

      await clickToggleFilters(user);
      await fillGradeFilter(user, "B-", "A+");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByLabelText("Remove Grade: B- to A+ filter"),
      ).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("removing grade chip defers list update until View Results", async ({
      expect,
    }) => {
      vi.useFakeTimers({ shouldAdvanceTime: true });

      renderItems([
        { gradeValue: 6, title: "Bad Movie" },
        { gradeValue: 16, title: "Great Movie" },
      ]);

      const user = getUserWithFakeTimers();

      await clickToggleFilters(user);
      await fillGradeFilter(user, "B-", "A+");
      await clickViewResults(user);

      expect(within(getList()).getByText("Great Movie")).toBeInTheDocument();
      expect(
        within(getList()).queryByText("Bad Movie"),
      ).not.toBeInTheDocument();

      // Open drawer and click chip
      await clickToggleFilters(user);
      const chip = screen.getByLabelText("Remove Grade: B- to A+ filter");
      await user.click(chip);

      // Before clicking View Results, list should still be filtered
      expect(within(getList()).getByText("Great Movie")).toBeInTheDocument();
      expect(
        within(getList()).queryByText("Bad Movie"),
      ).not.toBeInTheDocument();

      // Apply the change
      await clickViewResults(user);

      // Now both items should appear
      expect(within(getList()).getByText("Great Movie")).toBeInTheDocument();
      expect(within(getList()).getByText("Bad Movie")).toBeInTheDocument();

      vi.clearAllTimers();
      vi.useRealTimers();
    });
  });
}

async function fillGradeFilter(
  user: UserEvent,
  value1: string,
  value2: string,
) {
  const fieldset = screen.getByRole("group", { name: "Grade" });
  const fromInput = within(fieldset).getByLabelText("From");
  const toInput = within(fieldset).getByLabelText("to");

  await user.selectOptions(fromInput, value1);
  await user.selectOptions(toInput, value2);
}
