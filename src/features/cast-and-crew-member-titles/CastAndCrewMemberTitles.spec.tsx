import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, vi } from "vitest";

import { creditedAsFilterTests } from "~/components/filter-and-sort/facets/credited-as/creditedAsFilterTests";
import { genresFilterTests } from "~/components/filter-and-sort/facets/genres/genresFilterTests";
import { gradeFilterFacetTests } from "~/components/filter-and-sort/facets/grade/gradeFilterTests";
import { gradeSortTests } from "~/components/filter-and-sort/facets/grade/gradeSortTests";
import { releaseDateSortTests } from "~/components/filter-and-sort/facets/release-date/releaseDateSortTests";
import { releaseYearFilterTests } from "~/components/filter-and-sort/facets/release-year/releaseYearFilterTests";
import { reviewDateSortTests } from "~/components/filter-and-sort/facets/review-date/reviewDateSortTests";
import { reviewYearFilterTests } from "~/components/filter-and-sort/facets/review-year/reviewYearFilterTests";
import { reviewedStatusFilterTests } from "~/components/filter-and-sort/facets/reviewed-status/reviewedStatusFilterTests";
import { titleFilterTests } from "~/components/filter-and-sort/facets/title/titleFilterTests";
import { titleSortTests } from "~/components/filter-and-sort/facets/title/titleSortTests";
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

  creditedAsFilterTests(
    (items) =>
      render(
        <CastAndCrewMemberTitles {...baseProps} values={createTitles(items)} />,
      ),
    getPosterList,
  );

  titleFilterTests(
    (items) =>
      render(
        <CastAndCrewMemberTitles {...baseProps} values={createTitles(items)} />,
      ),
    getPosterList,
  );

  titleSortTests(
    (items) =>
      render(
        <CastAndCrewMemberTitles {...baseProps} values={createTitles(items)} />,
      ),
    getPosterList,
  );

  genresFilterTests(
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

  gradeSortTests(
    (items) =>
      render(
        <CastAndCrewMemberTitles {...baseProps} values={createTitles(items)} />,
      ),
    getPosterList,
  );

  releaseYearFilterTests({
    distinctReleaseYears: baseProps.distinctReleaseYears,
    getList: getPosterList,
    renderItems: (items) =>
      render(
        <CastAndCrewMemberTitles {...baseProps} values={createTitles(items)} />,
      ),
  });

  releaseDateSortTests(
    (items) =>
      render(
        <CastAndCrewMemberTitles {...baseProps} values={createTitles(items)} />,
      ),
    getPosterList,
  );

  reviewYearFilterTests({
    distinctReviewYears: baseProps.distinctReviewYears,
    getList: getPosterList,
    renderItems: (items) =>
      render(
        <CastAndCrewMemberTitles {...baseProps} values={createTitles(items)} />,
      ),
  });

  reviewDateSortTests(
    (items) =>
      render(
        <CastAndCrewMemberTitles {...baseProps} values={createTitles(items)} />,
      ),
    getPosterList,
  );

  reviewedStatusFilterTests(
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
