import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import {
  clickClearFilters,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { genresFilterFacetTests } from "~/components/filter-and-sort/facets/genres/genresFacetTests";
import {
  gradeFilterFacetTests,
  gradeSortFacetTests,
} from "~/components/filter-and-sort/facets/grade/gradeFacetTests";
import {
  releaseYearFilterFacetTests,
  releaseYearSortFacetTests,
} from "~/components/filter-and-sort/facets/release-year/releaseYearFacetTests";
import {
  reviewYearFilterFacetTests,
  reviewYearSortFacetTests,
} from "~/components/filter-and-sort/facets/review-year/reviewYearFacetTests";
import {
  titleFacetFilterTests,
  titleFacetSortTests,
} from "~/components/filter-and-sort/facets/title/titleFacetTests";
import {
  clickGenresFilterOption,
  fillTitleFilter,
  getTitleFilter,
} from "~/components/filter-and-sort/ReviewedTitleFilters.testHelper";
import {
  clickShowMore,
  getPosterList,
} from "~/components/poster-list/PosterList.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import { Reviews } from "./Reviews";
import { baseProps, createReviewValue, resetTestIdCounter } from "./testHelper";

describe("Reviews", () => {
  beforeEach(() => {
    resetTestIdCounter();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  titleFacetFilterTests(
    (items) =>
      render(
        <Reviews
          {...baseProps}
          values={items.map((item) => createReviewValue(item))}
        />,
      ),
    getPosterList,
  );

  titleFacetSortTests(
    (items) =>
      render(
        <Reviews
          {...baseProps}
          values={items.map((item) => createReviewValue(item))}
        />,
      ),
    getPosterList,
  );

  genresFilterFacetTests(
    (items) =>
      render(
        <Reviews
          {...baseProps}
          values={items.map((item) => createReviewValue(item))}
        />,
      ),
    getPosterList,
  );

  gradeFilterFacetTests(
    (items) =>
      render(
        <Reviews
          {...baseProps}
          values={items.map((item) => createReviewValue(item))}
        />,
      ),
    getPosterList,
  );

  gradeSortFacetTests(
    (items) =>
      render(
        <Reviews
          {...baseProps}
          values={items.map((item) => createReviewValue(item))}
        />,
      ),
    getPosterList,
  );

  releaseYearFilterFacetTests({
    distinctReleaseYears: baseProps.distinctReleaseYears,
    getList: getPosterList,
    renderItems: (items) =>
      render(
        <Reviews
          {...baseProps}
          values={items.map((item) => createReviewValue(item))}
        />,
      ),
  });

  releaseYearSortFacetTests(
    (items) =>
      render(
        <Reviews
          {...baseProps}
          values={items.map((item) => createReviewValue(item))}
        />,
      ),
    getPosterList,
  );

  reviewYearFilterFacetTests({
    distinctReviewYears: baseProps.distinctReviewYears,
    getList: getPosterList,
    renderItems: (items) =>
      render(
        <Reviews
          {...baseProps}
          values={items.map((item) => createReviewValue(item))}
        />,
      ),
  });

  reviewYearSortFacetTests(
    (items) =>
      render(
        <Reviews
          {...baseProps}
          values={items.map((item) => createReviewValue(item))}
        />,
      ),
    getPosterList,
  );

  describe("when clearing filters", () => {
    it("clears all filters with clear button", async ({ expect }) => {
      const reviews = [
        createReviewValue({ genres: ["Horror"], title: "Halloween" }),
        createReviewValue({ genres: ["Sci-Fi"], title: "The Thing" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Halloween");
      await clickGenresFilterOption(user, "Horror");
      await clickViewResults(user);

      let posterList = getPosterList();
      expect(within(posterList).getByText("Halloween")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Thing"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await clickClearFilters(user);

      expect(getTitleFilter()).toHaveValue("");

      await clickViewResults(user);

      posterList = getPosterList();
      expect(within(posterList).getByText("Halloween")).toBeInTheDocument();
      expect(within(posterList).getByText("The Thing")).toBeInTheDocument();
    });
  });

  describe("applied filters", () => {
    it("removes individual genre when multiple genres are selected", async ({
      expect,
    }) => {
      const reviews = [
        createReviewValue({
          genres: ["Horror"],
          title: "The Exorcist",
        }),
        createReviewValue({
          genres: ["Horror", "Sci-Fi"],
          title: "Alien",
        }),
        createReviewValue({
          genres: ["Sci-Fi"],
          title: "Star Wars",
        }),
        createReviewValue({
          genres: ["Action"],
          title: "Die Hard",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

      // Apply both Horror and Sci-Fi filters (OR logic - must have at least one)
      await clickToggleFilters(user);
      await clickGenresFilterOption(user, "Horror");
      await clickGenresFilterOption(user, "Sci-Fi");
      await clickViewResults(user);

      // Verify both filters are applied - OR logic shows any movie with Horror OR Sci-Fi
      let posterList = getPosterList();
      expect(within(posterList).getByText("The Exorcist")).toBeInTheDocument();
      expect(within(posterList).getByText("Alien")).toBeInTheDocument();
      expect(within(posterList).getByText("Star Wars")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Die Hard"),
      ).not.toBeInTheDocument();

      // Remove only the Horror chip
      await clickToggleFilters(user);
      const horrorChip = screen.getByLabelText("Remove Horror filter");
      await user.click(horrorChip);

      // Apply the change
      await clickViewResults(user);

      // Verify Horror chip is removed but Sci-Fi remains after applying
      expect(
        screen.queryByLabelText("Remove Horror filter"),
      ).not.toBeInTheDocument();
      expect(screen.getByLabelText("Remove Sci-Fi filter")).toBeInTheDocument();

      // Verify only Sci-Fi filter is still active (shows movies with Sci-Fi)
      posterList = getPosterList();
      expect(
        within(posterList).queryByText("The Exorcist"),
      ).not.toBeInTheDocument();
      expect(within(posterList).getByText("Alien")).toBeInTheDocument();
      expect(within(posterList).getByText("Star Wars")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Die Hard"),
      ).not.toBeInTheDocument();
    });

    it("removes Film-Noir genre with hyphen correctly", async ({ expect }) => {
      const reviews = [
        createReviewValue({
          genres: ["Film-Noir"],
          title: "Double Indemnity",
        }),
        createReviewValue({
          genres: ["Film-Noir", "Thriller"],
          title: "Touch of Evil",
        }),
        createReviewValue({
          genres: ["Horror"],
          title: "Halloween",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(
        <Reviews
          {...baseProps}
          distinctGenres={[...baseProps.distinctGenres, "Film-Noir"]}
          values={reviews}
        />,
      );

      // Apply Film-Noir filter
      await clickToggleFilters(user);
      await clickGenresFilterOption(user, "Film-Noir");
      await clickViewResults(user);

      // Verify filter is applied
      let posterList = getPosterList();
      expect(
        within(posterList).getByText("Double Indemnity"),
      ).toBeInTheDocument();
      expect(within(posterList).getByText("Touch of Evil")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Halloween"),
      ).not.toBeInTheDocument();

      // Click the Film-Noir chip to remove it
      await clickToggleFilters(user);
      const filmNoirChip = screen.getByLabelText("Remove Film-Noir filter");
      await user.click(filmNoirChip);

      // Apply the change
      await clickViewResults(user);

      // Verify the chip is removed from the UI after applying
      expect(
        screen.queryByLabelText("Remove Film-Noir filter"),
      ).not.toBeInTheDocument();

      // Verify all movies are now shown
      posterList = getPosterList();
      expect(
        within(posterList).getByText("Double Indemnity"),
      ).toBeInTheDocument();
      expect(within(posterList).getByText("Touch of Evil")).toBeInTheDocument();
      expect(within(posterList).getByText("Halloween")).toBeInTheDocument();
    });
  });

  describe("pagination", () => {
    it("shows more titles when clicking show more", async ({ expect }) => {
      // Create 110 reviews to force pagination
      const reviews = Array.from({ length: 110 }, (_, i) =>
        createReviewValue({
          reviewSequence: (3000 - i).toString(), // Higher sequences for newer reviews
          reviewYear: String(2020 - Math.floor(i / 10)),
          title: `Movie ${i + 1}`,
        }),
      );

      const user = getUserWithFakeTimers();
      render(<Reviews {...baseProps} values={reviews} />);

      const posterList = getPosterList();

      // Should show first 100 movies
      expect(within(posterList).getByText("Movie 1")).toBeInTheDocument();
      expect(within(posterList).getByText("Movie 100")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Movie 101"),
      ).not.toBeInTheDocument();

      await clickShowMore(user);

      // Should now show all movies
      expect(within(posterList).getByText("Movie 101")).toBeInTheDocument();
      expect(within(posterList).getByText("Movie 110")).toBeInTheDocument();
    });
  });
});
