import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";

import {
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { clickReviewedStatusFilterOption } from "~/components/filter-and-sort/facets/reviewed-status/ReviewedStatusFacet.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

type ReviewedStatusItem = {
  reviewSlug: string | undefined;
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
export function reviewedStatusFacetTests(
  renderItems: (items: ReviewedStatusItem[]) => void,
  getList: () => HTMLElement,
) {
  describe("reviewed status filter", () => {
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
