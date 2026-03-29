import { render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { genresFilterFacetTests } from "~/components/filter-and-sort/facets/genres/genresFacetTests";
import { gradeFilterFacetTests } from "~/components/filter-and-sort/facets/grade/gradeFacetTests";
import {
  releaseYearFilterFacetTests,
  releaseYearSortFacetTests,
} from "~/components/filter-and-sort/facets/release-year/releaseYearFacetTests";
import { reviewYearFilterFacetTests } from "~/components/filter-and-sort/facets/review-year/reviewYearFacetTests";
import { reviewedStatusFacetTests } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusFacetTests";
import {
  titleFacetFilterTests,
  titleFacetSortTests,
} from "~/components/filter-and-sort/facets/title/titleFacetTests";
import {
  clickGenresFilterOption,
  fillTitleFilter,
  getTitleFilter,
} from "~/components/filter-and-sort/ReviewedTitleFilters.testHelper";
import { getPosterList } from "~/components/poster-list/PosterList.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type {
  CollectionTitlesProps,
  CollectionTitlesValue,
} from "./CollectionTitles";

import { CollectionTitles } from "./CollectionTitles";

const createCollectionTitles = (
  overrides: Partial<CollectionTitlesValue>[] = [],
): CollectionTitlesValue[] => {
  return overrides.map((override, index) => {
    return {
      genres: ["Action", "Adventure"],
      grade: "B",
      gradeValue: 7,
      imdbId: `tt${String(index).padStart(7, "0")}`,
      posterImageProps: {
        src: "/poster.jpg",
        srcSet: "/poster.jpg 1x",
      },
      releaseSequence: index,
      releaseYear: "1962",
      reviewDisplayDate: "Aug 22, 2024",
      reviewSequence: index.toString(),
      reviewSlug: `test-slug-${index}`,
      reviewYear: "2024",
      sortTitle: "Dr. No",
      title: "Dr. No",
      ...override,
    };
  });
};

const baseProps: CollectionTitlesProps = {
  distinctGenres: ["Action", "Adventure", "Thriller", "Comedy", "Drama"],
  distinctReleaseYears: [
    "1962",
    "1963",
    "1964",
    "1965",
    "1969",
    "1971",
    "1973",
    "1974",
  ],
  distinctReviewYears: ["2022", "2023", "2024"],
  initialSort: "release-date-desc",
  values: [],
};

describe("CollectionTitles", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("filtering", () => {
    titleFacetFilterTests(
      (items) =>
        render(
          <CollectionTitles
            {...baseProps}
            values={createCollectionTitles(items)}
          />,
        ),
      getPosterList,
    );

    genresFilterFacetTests(
      (items) =>
        render(
          <CollectionTitles
            {...baseProps}
            values={createCollectionTitles(items)}
          />,
        ),
      getPosterList,
    );

    releaseYearFilterFacetTests({
      distinctReleaseYears: baseProps.distinctReleaseYears,
      getList: getPosterList,
      renderItems: (items) =>
        render(
          <CollectionTitles
            {...baseProps}
            values={createCollectionTitles(items)}
          />,
        ),
    });

    reviewYearFilterFacetTests({
      distinctReviewYears: baseProps.distinctReviewYears,
      getList: getPosterList,
      renderItems: (items) =>
        render(
          <CollectionTitles
            {...baseProps}
            values={createCollectionTitles(items)}
          />,
        ),
    });

    gradeFilterFacetTests(
      (items) =>
        render(
          <CollectionTitles
            {...baseProps}
            values={createCollectionTitles(items)}
          />,
        ),
      getPosterList,
    );

    reviewedStatusFacetTests(
      (items) =>
        render(
          <CollectionTitles
            {...baseProps}
            values={createCollectionTitles(items)}
          />,
        ),
      getPosterList,
    );
  });

  describe("sorting", () => {
    titleFacetSortTests(
      (items) =>
        render(
          <CollectionTitles
            {...baseProps}
            values={createCollectionTitles(items)}
          />,
        ),
      getPosterList,
    );

    releaseYearSortFacetTests(
      (items) =>
        render(
          <CollectionTitles
            {...baseProps}
            values={createCollectionTitles(items)}
          />,
        ),
      getPosterList,
    );

    it("sorts by grade best first", async ({ expect }) => {
      const titles = createCollectionTitles([
        {
          grade: "A",
          gradeValue: 12,
          title: "Goldfinger",
        },
        {
          grade: "D",
          gradeValue: 3,
          title: "Die Another Day",
        },
        { grade: "B", gradeValue: 7, title: "Dr. No" },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Grade (Best First)");

      const posterList = getPosterList();
      const allText = posterList.textContent || "";
      const goldfingerIndex = allText.indexOf("Goldfinger");
      const drNoIndex = allText.indexOf("Dr. No");
      const dieIndex = allText.indexOf("Die Another Day");

      expect(goldfingerIndex).toBeLessThan(drNoIndex);
      expect(drNoIndex).toBeLessThan(dieIndex);
    });

    it("sorts by grade worst first", async ({ expect }) => {
      const titles = createCollectionTitles([
        {
          grade: "A",
          gradeValue: 12,
          title: "Goldfinger",
        },
        { grade: "B", gradeValue: 7, title: "Dr. No" },
        {
          grade: "D",
          gradeValue: 3,
          title: "Die Another Day",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Grade (Worst First)");

      const posterList = getPosterList();
      const allText = posterList.textContent || "";
      const dieIndex = allText.indexOf("Die Another Day");
      const drNoIndex = allText.indexOf("Dr. No");
      const goldfingerIndex = allText.indexOf("Goldfinger");

      expect(dieIndex).toBeLessThan(drNoIndex);
      expect(drNoIndex).toBeLessThan(goldfingerIndex);
    });

    it("sorts by review date oldest first", async ({ expect }) => {
      const titles = createCollectionTitles([
        { reviewSequence: "3", title: "Casino Royale" },
        { reviewSequence: "1", title: "Dr. No" },
        { reviewSequence: "2", title: "Skyfall" },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Review Date (Oldest First)");

      const posterList = getPosterList();
      const allText = posterList.textContent || "";
      const drNoIndex = allText.indexOf("Dr. No");
      const skyfallIndex = allText.indexOf("Skyfall");
      const casinoIndex = allText.indexOf("Casino Royale");

      expect(drNoIndex).toBeLessThan(skyfallIndex);
      expect(skyfallIndex).toBeLessThan(casinoIndex);
    });

    it("sorts by review date newest first", async ({ expect }) => {
      const titles = createCollectionTitles([
        { reviewSequence: "1", title: "Dr. No" },
        { reviewSequence: "2", title: "Skyfall" },
        { reviewSequence: "3", title: "Casino Royale" },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickSortOption(user, "Review Date (Newest First)");

      const posterList = getPosterList();
      const allText = posterList.textContent || "";
      const casinoIndex = allText.indexOf("Casino Royale");
      const skyfallIndex = allText.indexOf("Skyfall");
      const drNoIndex = allText.indexOf("Dr. No");

      expect(casinoIndex).toBeLessThan(skyfallIndex);
      expect(skyfallIndex).toBeLessThan(drNoIndex);
    });
  });

  describe("when clearing filters", () => {
    it("clears all filters with clear button", async ({ expect }) => {
      const titles = createCollectionTitles([
        { genres: ["Action"], title: "Dr. No" },
        { genres: ["Thriller"], title: "Goldfinger" },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dr. No");
      await clickGenresFilterOption(user, "Action");
      await clickViewResults(user);

      let posterList = getPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Goldfinger"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await clickClearFilters(user);

      expect(getTitleFilter()).toHaveValue("");

      await clickViewResults(user);

      posterList = getPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(within(posterList).getByText("Goldfinger")).toBeInTheDocument();
    });
  });

  describe("when closing filter drawer without applying", () => {
    it("resets pending filter changes", async ({ expect }) => {
      const titles = createCollectionTitles([
        { title: "Dr. No" },
        { title: "Goldfinger" },
      ]);

      const user = getUserWithFakeTimers();
      render(<CollectionTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Dr. No");
      await clickViewResults(user);

      let posterList = getPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Goldfinger"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Different");
      await clickCloseFilters(user);

      posterList = getPosterList();
      expect(within(posterList).getByText("Dr. No")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Goldfinger"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      expect(getTitleFilter()).toHaveValue("Dr. No");
    });
  });
});
