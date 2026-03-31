import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, vi } from "vitest";

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
  CollectionTitlesProps,
  CollectionTitlesValue,
} from "./CollectionTitles";

import { CollectionTitles } from "./CollectionTitles";

const createCollectionTitles = (
  overrides: Partial<CollectionTitlesValue>[] = [],
): CollectionTitlesValue[] => {
  return overrides.map((override, index) => {
    return {
      genres: override.genres ?? ["Action", "Adventure"],
      grade: "B",
      gradeValue: 7,
      imdbId: `tt${String(index).padStart(7, "0")}`,
      posterImageProps: {
        height: 372,
        src: "/poster.jpg",
        srcSet: "/poster.jpg 1x",
        width: 248,
      },
      releaseSequence: index,
      releaseYear: "1962",
      reviewDisplayDate: "Aug 22, 2024",
      reviewSequence: index.toString(),
      reviewSlug: `test-slug-${index}`,
      reviewYear: "2024",
      sortTitle: "Dr. No",
      title: override.title ?? "Dr. No",
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

  titleFilterTests(
    (items) =>
      render(
        <CollectionTitles
          {...baseProps}
          values={createCollectionTitles(items)}
        />,
      ),
    getPosterList,
  );

  genresFilterTests((items) => {
    const distinctGenres = new Set<string>();
    for (const item of items) {
      for (const genre of item.genres) {
        distinctGenres.add(genre);
      }
    }
    render(
      <CollectionTitles
        {...baseProps}
        distinctGenres={[...distinctGenres]}
        values={createCollectionTitles(items)}
      />,
    );
  }, getPosterList);

  releaseYearFilterTests({
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

  reviewYearFilterTests({
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

  reviewedStatusFilterTests(
    (items) =>
      render(
        <CollectionTitles
          {...baseProps}
          values={createCollectionTitles(items)}
        />,
      ),
    getPosterList,
  );

  titleSortTests(
    (items) =>
      render(
        <CollectionTitles
          {...baseProps}
          values={createCollectionTitles(items)}
        />,
      ),
    getPosterList,
  );

  releaseDateSortTests(
    (items) =>
      render(
        <CollectionTitles
          {...baseProps}
          values={createCollectionTitles(items)}
        />,
      ),
    getPosterList,
  );

  gradeSortTests(
    (items) =>
      render(
        <CollectionTitles
          {...baseProps}
          values={createCollectionTitles(items)}
        />,
      ),
    getPosterList,
  );

  reviewDateSortTests(
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
