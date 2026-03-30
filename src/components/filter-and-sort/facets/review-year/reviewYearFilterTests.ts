import { screen, within } from "@testing-library/react";
import { describe, it } from "vitest";

import {
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { fillYearField } from "~/components/filter-and-sort/fields/YearField.testHelper";
import { getUserWithFakeTimers } from "~/utils/testUtils";

import type { FilterableValue } from "./reviewYearFilter";

type ReviewYearFilterItem = FilterableValue & {
  title: string;
};

/**
 * Filter-only sub-suite for review year. Covers filter range and chip.
 *
 * @example
 * reviewYearFilterFacetTests({
 *   distinctReviewYears: ["2020", "2021", "2022", "2023", "2024"],
 *   getList: getCoverList,
 *   renderItems: (items) => render(<Reviews {...baseProps} values={items.map(createValue)} />),
 * });
 */
export function reviewYearFilterTests({
  distinctReviewYears,
  getList,
  renderItems,
}: {
  /**
   * Distinct review years available in the filter, in ascending order.
   * Must contain at least 3 elements so that index [2] is a valid mid-range
   * year distinct from both the minimum ([0]) and the maximum (last element).
   */
  distinctReviewYears: readonly string[];
  getList: () => HTMLElement;
  renderItems: (items: ReviewYearFilterItem[]) => void;
}) {
  if (distinctReviewYears.length < 3) {
    throw new Error(
      `reviewYearFilterFacetTests: distinctReviewYears must have at least 3 elements (got ${distinctReviewYears.length.toString()})`,
    );
  }

  describe("reviewYearFilter", () => {
    it("filters to items within review year range", async ({ expect }) => {
      renderItems([
        { reviewYear: distinctReviewYears[0], title: "0 Review" },
        { reviewYear: distinctReviewYears[1], title: "1 Review" },
        { reviewYear: distinctReviewYears[2], title: "2 Review" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillYearField(
        user,
        "Review Year",
        distinctReviewYears[1],
        distinctReviewYears[1],
      );
      await clickViewResults(user);

      const list = getList();
      expect(within(list).getByText("1 Review")).toBeInTheDocument();
      expect(within(list).queryByText("0 Review")).not.toBeInTheDocument();
      expect(within(list).queryByText("2 Review")).not.toBeInTheDocument();
    });
  });

  describe("review year filter chip", () => {
    // Filter to a single mid-range year so the chip appears (not the full range)
    // and items outside it are hidden, proving filter and chip work together.
    const earlyYear = distinctReviewYears[0];
    const midYear = distinctReviewYears[2];

    it("shows review year chip after applying filter", async ({ expect }) => {
      renderItems([
        { reviewYear: earlyYear, title: "Early Review" },
        { reviewYear: midYear, title: "Mid Review" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillYearField(user, "Review Year", midYear, midYear);
      await clickViewResults(user);

      await clickToggleFilters(user);
      expect(
        screen.getByRole("button", {
          name: `Remove Review Year: ${midYear} filter`,
        }),
      ).toBeInTheDocument();
    });

    it("removing review year chip defers list update", async ({ expect }) => {
      renderItems([
        { reviewYear: earlyYear, title: "Early Review" },
        { reviewYear: midYear, title: "Mid Review" },
      ]);

      const user = getUserWithFakeTimers();
      await clickToggleFilters(user);
      await fillYearField(user, "Review Year", midYear, midYear);
      await clickViewResults(user);

      const list = getList();
      expect(within(list).queryByText("Early Review")).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await user.click(
        screen.getByRole("button", {
          name: `Remove Review Year: ${midYear} filter`,
        }),
      );

      expect(
        screen.queryByRole("button", {
          name: `Remove Review Year: ${midYear} filter`,
        }),
      ).not.toBeInTheDocument();
      // List still filtered (activeFilter not yet cleared)
      expect(within(list).queryByText("Early Review")).not.toBeInTheDocument();

      await clickViewResults(user);
      expect(within(list).getByText("Early Review")).toBeInTheDocument();
    });
  });
}
