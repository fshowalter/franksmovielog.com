import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, vi } from "vitest";

import { genresFilterTests } from "~/components/filter-and-sort/facets/genres/genresFilterTests";
import { gradeFilterFacetTests } from "~/components/filter-and-sort/facets/grade/gradeFilterTests";
import { gradeSortTests } from "~/components/filter-and-sort/facets/grade/gradeSortTests";
import { releaseDateSortTests } from "~/components/filter-and-sort/facets/release-date/releaseDateSortTests";
import { releaseYearFilterTests } from "~/components/filter-and-sort/facets/release-year/releaseYearFilterTests";
import { reviewDateSortTests } from "~/components/filter-and-sort/facets/review-date/reviewDateSortTests";
import { reviewYearFilterTests } from "~/components/filter-and-sort/facets/review-year/reviewYearFilterTests";
import { titleFilterTests } from "~/components/filter-and-sort/facets/title/titleFilterTests";
import { titleSortTests } from "~/components/filter-and-sort/facets/title/titleSortTests";
import { paginationTests } from "~/components/filter-and-sort/paginated-list/paginationTests";
import { getPosterList } from "~/components/poster-list/PosterList.testHelper";

import type { ReviewsValue } from "./Reviews";

import { Reviews } from "./Reviews";

function createReviewValues(
  overrides: Partial<ReviewsValue>[] = [],
): ReviewsValue[] {
  return overrides.map((override, index) => {
    const testId = index + 1;

    return {
      genres: ["Drama"],
      grade: "B",
      gradeValue: 9,
      imdbId: `tt${String(testId).padStart(7, "0")}`,
      posterSrcProps: {
        src: "/poster.jpg",
        srcSet: "/poster.jpg 1x",
      },
      releaseSequence: testId,
      releaseYear: "1970",
      reviewDisplayDate: "Jan 1, 2020",
      reviewSequence: testId.toString(),
      reviewYear: "2020",
      slug: `test-movie-${testId}`,
      sortTitle: `Test Movie ${testId}`,
      title: `Test Movie ${testId}`,
      ...override,
    };
  });
}

const baseProps = {
  distinctGenres: ["Drama", "Horror", "Thriller", "Action", "Comedy", "Sci-Fi"],
  distinctReleaseYears: [
    "1960",
    "1970",
    "1980",
    "1990",
    "2000",
    "2010",
    "2020",
  ],
  distinctReviewYears: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
  initialSort: "review-date-desc" as const,
  posterHeight: 372,
  posterWidth: 248,
  values: [],
};

describe("Reviews", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  titleFilterTests(
    (items) =>
      render(<Reviews {...baseProps} values={createReviewValues(items)} />),
    getPosterList,
  );

  titleSortTests(
    (items) =>
      render(<Reviews {...baseProps} values={createReviewValues(items)} />),
    getPosterList,
  );

  genresFilterTests(
    (items) =>
      render(<Reviews {...baseProps} values={createReviewValues(items)} />),
    getPosterList,
  );

  gradeFilterFacetTests(
    (items) =>
      render(<Reviews {...baseProps} values={createReviewValues(items)} />),
    getPosterList,
  );

  gradeSortTests(
    (items) =>
      render(<Reviews {...baseProps} values={createReviewValues(items)} />),
    getPosterList,
  );

  releaseYearFilterTests({
    distinctReleaseYears: baseProps.distinctReleaseYears,
    getList: getPosterList,
    renderItems: (items) =>
      render(<Reviews {...baseProps} values={createReviewValues(items)} />),
  });

  releaseDateSortTests(
    (items) =>
      render(<Reviews {...baseProps} values={createReviewValues(items)} />),
    getPosterList,
  );

  reviewYearFilterTests({
    distinctReviewYears: baseProps.distinctReviewYears,
    getList: getPosterList,
    renderItems: (items) =>
      render(<Reviews {...baseProps} values={createReviewValues(items)} />),
  });

  reviewDateSortTests(
    (items) =>
      render(<Reviews {...baseProps} values={createReviewValues(items)} />),
    getPosterList,
  );

  paginationTests(
    (items) =>
      render(
        <Reviews
          {...baseProps}
          initialSort="title-asc"
          values={createReviewValues(
            items.map((item) => {
              return { title: item };
            }),
          )}
        />,
      ),
    getPosterList,
  );
});
