import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";

import {
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { FilterableValue } from "./reviewedStatusFilter";

type ReviewedStatusFilterItem = FilterableValue & {
  title: string;
};

/**
 * Shared test suite for the reviewed status filter facet.
 *
 * @example
 * reviewedStatusFacetTests((items) => {
 *   render(<Reviews {...baseProps} values={items.map(createValue)} />);
 * });
 *
 * @example — with custom container (e.g. ReadingLog calendar)
 * reviewedStatusFacetTests((items) => { render(...) }, getCalendar);
 */
export function reviewedStatusFilterTests(
  renderItems: (items: ReviewedStatusFilterItem[]) => void,
  getList: () => HTMLElement,
) {
  describe("reviewedStatusFilter", () => {
    it("filters to reviewed items", async ({ expect }) => {
      renderItems([
        {
          reviewSlug: "reviewed",
          title: "reviewed title",
        },
        { reviewSlug: undefined, title: "unreviewed title" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickReviewedStatusFilterOption(user, "Reviewed");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("reviewed title")).toBeInTheDocument();
      expect(
        within(list).queryByText("unreviewed title"),
      ).not.toBeInTheDocument();
    });

    it("filters to unreviewed items", async ({ expect }) => {
      renderItems([
        {
          reviewSlug: "reviewed",
          title: "reviewed title",
        },
        { reviewSlug: undefined, title: "unreviewed title" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickReviewedStatusFilterOption(user, "Not Reviewed");
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("unreviewed title")).toBeInTheDocument();
      expect(
        within(list).queryByText("reviewed title"),
      ).not.toBeInTheDocument();
    });

    it("shows status chip after applying", async ({ expect }) => {
      renderItems([
        {
          reviewSlug: "reviewed",
          title: "reviewed title",
        },
        { reviewSlug: undefined, title: "unreviewed title" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await clickReviewedStatusFilterOption(user, "Reviewed");
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByRole("button", { name: "Remove Reviewed filter" }),
      ).toBeInTheDocument();
    });
  });
}

async function clickReviewedStatusFilterOption(
  user: UserEvent,
  status: string,
) {
  const checkboxes = screen.getAllByRole("checkbox");
  const checkbox = checkboxes.find(
    (cb) => (cb as HTMLInputElement).value === status,
  );
  if (!checkbox) {
    throw new Error(
      `Unable to find status checkbox with value "${status}". Available: ${checkboxes.map((cb) => (cb as HTMLInputElement).value).join(", ")}`,
    );
  }
  await user.click(checkbox);
}
