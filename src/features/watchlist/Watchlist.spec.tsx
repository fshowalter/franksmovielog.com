import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, vi } from "vitest";

import { collectionsFilterTests } from "~/components/filter-and-sort/facets/collections/collectionsFilterTests";
import { directorsFilterTests } from "~/components/filter-and-sort/facets/directors/directorsFilterTests";
import { genresFilterTests } from "~/components/filter-and-sort/facets/genres/genresFilterTests";
import { performersFilterTests } from "~/components/filter-and-sort/facets/performers/performersFilterTests";
import { releaseDateSortTests } from "~/components/filter-and-sort/facets/release-date/releaseDateSortTests";
import { releaseYearFilterTests } from "~/components/filter-and-sort/facets/release-year/releaseYearFilterTests";
import { titleFilterTests } from "~/components/filter-and-sort/facets/title/titleFilterTests";
import { titleSortTests } from "~/components/filter-and-sort/facets/title/titleSortTests";
import { writersFilterTests } from "~/components/filter-and-sort/facets/writers/writersFilterTests";
import { paginationTests } from "~/components/filter-and-sort/paginated-list/paginationTests";
import { getPosterList } from "~/components/poster-list/PosterList.testHelper";

import type { WatchlistProps, WatchlistValue } from "./Watchlist";

import { Watchlist } from "./Watchlist";

// Inline minimal fixture data for testing
let testIdCounter = 0;
const createWatchlistTitle = (
  overrides: Partial<WatchlistValue> = {},
): WatchlistValue => {
  testIdCounter += 1;
  return {
    genres: [],
    imdbId: overrides.imdbId ?? `tt${String(testIdCounter).padStart(7, "0")}`,
    releaseSequence: testIdCounter,
    releaseYear: "1959",
    sortTitle: "Rio Bravo",
    title: "Rio Bravo",
    watchlistCollectionNames: [],
    watchlistDirectorNames: [],
    watchlistPerformerNames: [],
    watchlistWriterNames: [],
    ...overrides,
  };
};

const baseProps: WatchlistProps = {
  defaultPosterImageProps: {
    src: "/default-poster.jpg",
    srcSet: "/default-poster.jpg 1x",
  },
  distinctCollections: ["Universal Monsters", "Hammer Horror"],
  distinctDirectors: [
    "Howard Hawks",
    "John Ford",
    "Alfred Hitchcock",
    "John Carpenter",
  ],
  distinctGenres: [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Sci-Fi",
    "Thriller",
    "Western",
  ],
  distinctPerformers: [
    "John Wayne",
    "Dean Martin",
    "Walter Brennan",
    "Eric Stoltz",
  ],
  distinctReleaseYears: [
    "1959",
    "1960",
    "1961",
    "1970",
    "1980",
    "1982",
    "1986",
  ],
  distinctWriters: [
    "Frank S. Nugent",
    "Jules Furthman",
    "Leigh Brackett",
    "William Faulkner",
  ],
  initialSort: "title-asc",
  values: [],
};

describe("Watchlist", () => {
  beforeEach(() => {
    testIdCounter = 0; // Reset counter for each test
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  titleFilterTests(
    (items) =>
      render(
        <Watchlist
          {...baseProps}
          values={items.map((item) => createWatchlistTitle(item))}
        />,
      ),
    getPosterList,
  );

  titleSortTests(
    (items) =>
      render(
        <Watchlist
          {...baseProps}
          values={items.map((item) => createWatchlistTitle(item))}
        />,
      ),
    getPosterList,
  );

  genresFilterTests(
    (items) =>
      render(
        <Watchlist
          {...baseProps}
          values={items.map((item) => createWatchlistTitle(item))}
        />,
      ),
    getPosterList,
  );

  releaseYearFilterTests({
    distinctReleaseYears: baseProps.distinctReleaseYears,
    getList: getPosterList,
    renderItems: (items) =>
      render(
        <Watchlist
          {...baseProps}
          values={items.map((item) => createWatchlistTitle(item))}
        />,
      ),
  });

  releaseDateSortTests(
    (items) =>
      render(
        <Watchlist
          {...baseProps}
          values={items.map((item) => createWatchlistTitle(item))}
        />,
      ),
    getPosterList,
  );

  directorsFilterTests(
    (items) =>
      render(
        <Watchlist
          {...baseProps}
          values={items.map((item) => createWatchlistTitle(item))}
        />,
      ),
    getPosterList,
  );

  performersFilterTests(
    (items) =>
      render(
        <Watchlist
          {...baseProps}
          values={items.map((item) => createWatchlistTitle(item))}
        />,
      ),
    getPosterList,
  );

  writersFilterTests(
    (items) =>
      render(
        <Watchlist
          {...baseProps}
          values={items.map((item) => createWatchlistTitle(item))}
        />,
      ),
    getPosterList,
  );

  collectionsFilterTests(
    (items) =>
      render(
        <Watchlist
          {...baseProps}
          values={items.map((item) => createWatchlistTitle(item))}
        />,
      ),
    getPosterList,
  );

  paginationTests(
    (items) =>
      render(
        <Watchlist
          {...baseProps}
          values={items.map((item) => createWatchlistTitle({ title: item }))}
        />,
      ),
    getPosterList,
  );
});
