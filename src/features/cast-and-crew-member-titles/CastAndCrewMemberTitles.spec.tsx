import { render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import {
  clickCreditedAsFilterOption,
  getCreditedAsFilter,
} from "~/components/filter-and-sort/CreditedAsFilter.testHelper";
import {
  clickClearFilters,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import {
  fillTitleFilter,
  getTitleFilter,
} from "~/components/filter-and-sort/ReviewedTitleFilters.testHelper";
import { getPosterList } from "~/components/poster-list/PosterList.testHelper";
import { genresFilterFacetTests } from "~/facets/genres/genresFacetTests";
import {
  gradeFilterFacetTests,
  gradeSortFacetTests,
} from "~/facets/grade/gradeFacetTests";
import {
  releaseYearFilterFacetTests,
  releaseYearSortFacetTests,
} from "~/facets/releaseYear/releaseYearFacetTests";
import { reviewedStatusFilterFacetTests } from "~/facets/reviewedStatus/reviewedStatusFacetTests";
import {
  reviewYearFilterFacetTests,
  reviewYearSortFacetTests,
} from "~/facets/reviewYear/reviewYearFacetTests";
import {
  titleFilterFacetTests,
  titleSortFacetTests,
} from "~/facets/title/titleFacetTests";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type {
  CastAndCrewMemberTitlesProps,
  CastAndCrewMemberTitlesValue,
} from "./CastAndCrewMemberTitles";

import { CastAndCrewMemberTitles } from "./CastAndCrewMemberTitles";

const createTitles = (
  overrides: Partial<CastAndCrewMemberTitlesValue>[],
): CastAndCrewMemberTitlesValue[] => {
  return overrides.map((override, index) => {
    return {
      creditedAs: ["Director"],
      excerpt: "test excerpt",
      genres: ["Drama"],
      grade: "B+",
      gradeValue: 8,
      imdbId: `tt${String(index).padStart(7, "0")}`,
      posterImageProps: {
        src: "/poster.jpg",
        srcSet: "/poster.jpg 1x",
      },
      releaseSequence: index,
      releaseYear: "1960",
      reviewDisplayDate: "Jan 1, 2020",
      reviewSequence: index.toLocaleString(),
      reviewSlug: undefined,
      reviewYear: "2020",
      slug: `test-movie-${index}`,
      sortTitle: `Test Movie ${index}`,
      title: `Test Movie ${index}`,
      watchlistCollectionNames: [],
      watchlistDirectorNames: [],
      watchlistPerformerNames: [],
      watchlistWriterNames: [],
      ...override,
    };
  });
};

const baseProps: CastAndCrewMemberTitlesProps = {
  distinctCreditKinds: ["Director", "Writer", "Performer"],
  distinctGenres: ["Drama", "Thriller", "Horror", "Comedy", "Action"],
  distinctReleaseYears: ["1950", "1960", "1965", "1970", "1975", "1980"],
  distinctReviewYears: ["2019", "2020", "2021", "2022"],
  initialSort: "release-date-desc",
  values: [],
};

// AIDEV-NOTE: Facet test suites are called at module level (outside the outer describe)
// so they don't inherit the describe's beforeEach/afterEach timer setup.
// Each facet test manages its own vi.useFakeTimers() / vi.useRealTimers() lifecycle.
titleFilterFacetTests(
  (items) =>
    render(
      <CastAndCrewMemberTitles {...baseProps} values={createTitles(items)} />,
    ),
  getPosterList,
);

titleSortFacetTests(
  (items) =>
    render(
      <CastAndCrewMemberTitles {...baseProps} values={createTitles(items)} />,
    ),
  getPosterList,
);

genresFilterFacetTests(
  (items) =>
    render(
      <CastAndCrewMemberTitles
        {...baseProps}
        distinctGenres={[...baseProps.distinctGenres, "Sci-Fi"]}
        values={createTitles(items)}
      />,
    ),
  getPosterList,
);

gradeFilterFacetTests(
  (items) =>
    render(
      <CastAndCrewMemberTitles {...baseProps} values={createTitles(items)} />,
    ),
  getPosterList,
);

gradeSortFacetTests(
  (items) =>
    render(
      <CastAndCrewMemberTitles {...baseProps} values={createTitles(items)} />,
    ),
  getPosterList,
);

releaseYearFilterFacetTests({
  distinctReleaseYears: baseProps.distinctReleaseYears,
  getList: getPosterList,
  renderItems: (items) =>
    render(
      <CastAndCrewMemberTitles {...baseProps} values={createTitles(items)} />,
    ),
});

releaseYearSortFacetTests(
  (items) =>
    render(
      <CastAndCrewMemberTitles {...baseProps} values={createTitles(items)} />,
    ),
  getPosterList,
);

reviewYearFilterFacetTests({
  distinctReviewYears: baseProps.distinctReviewYears,
  getList: getPosterList,
  renderItems: (items) =>
    render(
      <CastAndCrewMemberTitles {...baseProps} values={createTitles(items)} />,
    ),
});

reviewYearSortFacetTests(
  (items) =>
    render(
      <CastAndCrewMemberTitles {...baseProps} values={createTitles(items)} />,
    ),
  getPosterList,
);

// AIDEV-NOTE: reviewedStatus "reviewed" = has reviewSlug; map grade presence → reviewSlug presence
reviewedStatusFilterFacetTests(
  (items) =>
    render(
      <CastAndCrewMemberTitles
        {...baseProps}
        values={createTitles(
          items.map((item) => ({
            ...item,
            reviewSequence: item.grade === undefined ? undefined : "1",
            reviewSlug: item.grade === undefined ? undefined : "test-slug",
            reviewYear: item.grade === undefined ? undefined : "2020",
          })),
        )}
      />,
    ),
  getPosterList,
);

describe("CastAndCrewMemberTitles", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("filtering", () => {
    it("filters by credited as", async ({ expect }) => {
      const titles = createTitles([
        {
          creditedAs: ["Director"],
          releaseYear: "1935",
          title: "The 39 Steps",
        },
        {
          creditedAs: ["Writer"],
          releaseYear: "1929",
          title: "Blackmail",
        },
        {
          creditedAs: ["Performer"],
          releaseYear: "1955",
          title: "To Catch a Thief",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await clickCreditedAsFilterOption(user, "Director");
      await clickViewResults(user);

      const reviewCardList = getPosterList();
      expect(
        within(reviewCardList).getByText("The 39 Steps"),
      ).toBeInTheDocument();
      expect(
        within(reviewCardList).queryByText("Blackmail"),
      ).not.toBeInTheDocument();
      expect(
        within(reviewCardList).queryByText("To Catch a Thief"),
      ).not.toBeInTheDocument();
    });
  });

  describe("when clearing filters", () => {
    it("clears all filters with clear button", async ({ expect }) => {
      const titles = createTitles([
        {
          creditedAs: ["Director"],
          releaseYear: "1946",
          title: "Notorious",
        },
        {
          creditedAs: ["Writer"],
          releaseYear: "1943",
          title: "Shadow of a Doubt",
        },
      ]);

      const user = getUserWithFakeTimers();
      render(<CastAndCrewMemberTitles {...baseProps} values={titles} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Notorious");
      await clickCreditedAsFilterOption(user, "Director");
      await clickViewResults(user);

      let reviewCardList = getPosterList();
      expect(within(reviewCardList).getByText("Notorious")).toBeInTheDocument();
      expect(
        within(reviewCardList).queryByText("Shadow of a Doubt"),
      ).not.toBeInTheDocument();

      await clickToggleFilters(user);
      await clickClearFilters(user);

      expect(getTitleFilter()).toHaveValue("");
      expect(getCreditedAsFilter()).toEqual([]);

      await clickViewResults(user);

      reviewCardList = getPosterList();
      expect(within(reviewCardList).getByText("Notorious")).toBeInTheDocument();
      expect(
        within(reviewCardList).getByText("Shadow of a Doubt"),
      ).toBeInTheDocument();
    });
  });
});
