import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, vi } from "vitest";

import { creditedAsFilterFacetTests } from "~/components/filter-and-sort/facets/credited-as/creditedAsFacetTests";
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
import { reviewedStatusFacetTests } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusFacetTests";
import {
  titleFacetFilterTests,
  titleFacetSortTests,
} from "~/components/filter-and-sort/facets/title/titleFacetTests";
import { getPosterList } from "~/components/poster-list/PosterList.testHelper";

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

describe("CastAndCrewMemberTitles", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  creditedAsFilterFacetTests(
    (items) =>
      render(
        <CastAndCrewMemberTitles {...baseProps} values={createTitles(items)} />,
      ),
    getPosterList,
  );
  titleFacetFilterTests(
    (items) =>
      render(
        <CastAndCrewMemberTitles {...baseProps} values={createTitles(items)} />,
      ),
    getPosterList,
  );

  titleFacetSortTests(
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

  reviewedStatusFacetTests(
    (items) =>
      render(
        <CastAndCrewMemberTitles
          {...baseProps}
          values={createTitles(
            items.map((item) => ({
              ...item,
              reviewSequence: item.reviewSlug === undefined ? undefined : "1",
              reviewSlug:
                item.reviewSlug === undefined ? undefined : "test-slug",
              reviewYear: item.reviewSlug === undefined ? undefined : "2020",
            })),
          )}
        />,
      ),
    getPosterList,
  );
});
