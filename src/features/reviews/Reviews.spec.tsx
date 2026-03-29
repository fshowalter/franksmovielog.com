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

  titleFilterTests(
    (items) =>
      render(
        <Reviews
          {...baseProps}
          values={items.map((item) => createReviewValue(item))}
        />,
      ),
    getPosterList,
  );

  titleSortTests(
    (items) =>
      render(
        <Reviews
          {...baseProps}
          values={items.map((item) => createReviewValue(item))}
        />,
      ),
    getPosterList,
  );

  genresFilterTests(
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

  gradeSortTests(
    (items) =>
      render(
        <Reviews
          {...baseProps}
          values={items.map((item) => createReviewValue(item))}
        />,
      ),
    getPosterList,
  );

  releaseYearFilterTests({
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

  releaseDateSortTests(
    (items) =>
      render(
        <Reviews
          {...baseProps}
          values={items.map((item) => createReviewValue(item))}
        />,
      ),
    getPosterList,
  );

  reviewYearFilterTests({
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

  reviewDateSortTests(
    (items) =>
      render(
        <Reviews
          {...baseProps}
          values={items.map((item) => createReviewValue(item))}
        />,
      ),
    getPosterList,
  );

  paginationTests(
    (items) =>
      render(
        <Reviews
          {...baseProps}
          values={items.map((item) => createReviewValue({ title: item }))}
        />,
      ),
    getPosterList,
  );
});
