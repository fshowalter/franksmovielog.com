import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import {
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { collectionsFilterFacetTests } from "~/components/filter-and-sort/facets/collections/collectionsFacetTests";
import { directorsFilterFacetTests } from "~/components/filter-and-sort/facets/directors/directorsFacetTests";
import { genresFilterFacetTests } from "~/components/filter-and-sort/facets/genres/genresFacetTests";
import { performersFilterFacetTests } from "~/components/filter-and-sort/facets/performers/performersFacetTests";
import {
  releaseYearFilterFacetTests,
  releaseYearSortFacetTests,
} from "~/components/filter-and-sort/facets/release-year/releaseYearFacetTests";
import {
  titleFacetFilterTests,
  titleFacetSortTests,
} from "~/components/filter-and-sort/facets/title/titleFacetTests";
import { writersFilterFacetTests } from "~/components/filter-and-sort/facets/writers/writersFacetTests";
import {
  clickGenresFilterOption,
  fillTitleFilter,
  getTitleFilter,
} from "~/components/filter-and-sort/TitleFilters.testHelper";
import { getPosterList } from "~/components/poster-list/PosterList.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type { WatchlistProps, WatchlistValue } from "./Watchlist";

import {
  calculateCollectionCounts,
  calculateDirectorCounts,
  calculateGenreCounts,
  calculatePerformerCounts,
  calculateWriterCounts,
} from "./filterWatchlistValues";
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

  titleFacetFilterTests(
    (items) =>
      render(
        <Watchlist
          {...baseProps}
          values={items.map((item) => createWatchlistTitle(item))}
        />,
      ),
    getPosterList,
  );

  titleFacetSortTests(
    (items) =>
      render(
        <Watchlist
          {...baseProps}
          values={items.map((item) => createWatchlistTitle(item))}
        />,
      ),
    getPosterList,
  );

  genresFilterFacetTests(
    (items) =>
      render(
        <Watchlist
          {...baseProps}
          values={items.map((item) => createWatchlistTitle(item))}
        />,
      ),
    getPosterList,
  );

  releaseYearFilterFacetTests({
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

  releaseYearSortFacetTests(
    (items) =>
      render(
        <Watchlist
          {...baseProps}
          values={items.map((item) => createWatchlistTitle(item))}
        />,
      ),
    getPosterList,
  );

  directorsFilterFacetTests(
    (items) =>
      render(
        <Watchlist
          {...baseProps}
          values={items.map((item) => createWatchlistTitle(item))}
        />,
      ),
    getPosterList,
  );

  performersFilterFacetTests(
    (items) =>
      render(
        <Watchlist
          {...baseProps}
          values={items.map((item) => createWatchlistTitle(item))}
        />,
      ),
    getPosterList,
  );

  writersFilterFacetTests(
    (items) =>
      render(
        <Watchlist
          {...baseProps}
          values={items.map((item) => createWatchlistTitle(item))}
        />,
      ),
    getPosterList,
  );

  collectionsFilterFacetTests(
    (items) =>
      render(
        <Watchlist
          {...baseProps}
          values={items.map((item) => createWatchlistTitle(item))}
        />,
      ),
    getPosterList,
  );

  describe("when reopening filter drawer", () => {
    it("maintains applied filter state", async ({ expect }) => {
      const testTitles = [
        createWatchlistTitle({ title: "Rio Bravo" }),
        createWatchlistTitle({ title: "The Magnificent Seven" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={testTitles} />);

      // Apply a filter
      await clickToggleFilters(user);
      await fillTitleFilter(user, "Rio");
      await clickViewResults(user);

      const posterList = getPosterList();
      expect(within(posterList).getByText("Rio Bravo")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Magnificent Seven"),
      ).not.toBeInTheDocument();

      // Reopen filter drawer - filter should still be applied
      await clickToggleFilters(user);
      const titleFilter = getTitleFilter();
      expect(titleFilter).toHaveValue("Rio");
    });
  });

  describe("pagination", () => {
    it("shows first 100 items by default", ({ expect }) => {
      // Create 150 test titles
      const testTitles = Array.from({ length: 150 }, (_, i) =>
        createWatchlistTitle({
          imdbId: `tt${String(i + 1).padStart(7, "0")}`,
          sortTitle: `Movie ${String(i + 1).padStart(3, "0")}`,
          title: `Movie ${String(i + 1).padStart(3, "0")}`,
        }),
      );

      render(<Watchlist {...baseProps} values={testTitles} />);

      const posterList = getPosterList();

      // Check that first 100 are visible
      expect(within(posterList).getByText("Movie 001")).toBeInTheDocument();
      expect(within(posterList).getByText("Movie 100")).toBeInTheDocument();

      // Check that 101st is not visible
      expect(
        within(posterList).queryByText("Movie 101"),
      ).not.toBeInTheDocument();

      // Show More button should be visible
      expect(screen.getByText("Show More")).toBeInTheDocument();
    });

    it("shows next batch of items when clicking Show More", async ({
      expect,
    }) => {
      // Create 150 test titles
      const testTitles = Array.from({ length: 150 }, (_, i) =>
        createWatchlistTitle({
          imdbId: `tt${String(i + 1).padStart(7, "0")}`,
          sortTitle: `Movie ${String(i + 1).padStart(3, "0")}`,
          title: `Movie ${String(i + 1).padStart(3, "0")}`,
        }),
      );

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={testTitles} />);

      // Click Show More
      await user.click(screen.getByText("Show More"));

      const posterList = getPosterList();

      // Check that items 101-150 are now visible
      expect(within(posterList).getByText("Movie 101")).toBeInTheDocument();
      expect(within(posterList).getByText("Movie 150")).toBeInTheDocument();

      // Show More button should no longer be visible (all items shown)
      expect(screen.queryByText("Show More")).not.toBeInTheDocument();
    });

    it("hides Show More button when all items are visible", ({ expect }) => {
      // Create only 50 test titles (less than the default 100)
      const testTitles = Array.from({ length: 50 }, (_, i) =>
        createWatchlistTitle({
          imdbId: `tt${String(i + 1).padStart(7, "0")}`,
          sortTitle: `Movie ${String(i + 1).padStart(3, "0")}`,
          title: `Movie ${String(i + 1).padStart(3, "0")}`,
        }),
      );

      render(<Watchlist {...baseProps} values={testTitles} />);

      // Show More button should not be visible when all items fit on first page
      expect(screen.queryByText("Show More")).not.toBeInTheDocument();
    });

    it("maintains pagination state when applying filters", async ({
      expect,
    }) => {
      // Create 150 test titles with varying genres
      const testTitles = Array.from({ length: 150 }, (_, i) =>
        createWatchlistTitle({
          genres: i < 80 ? ["Action"] : ["Horror"],
          imdbId: `tt${String(i + 1).padStart(7, "0")}`,
          sortTitle: `Movie ${String(i + 1).padStart(3, "0")}`,
          title: `Movie ${String(i + 1).padStart(3, "0")}`,
        }),
      );

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={testTitles} />);

      // Click Show More to show all 150 items
      await user.click(screen.getByText("Show More"));

      let posterList = getPosterList();
      expect(within(posterList).getByText("Movie 150")).toBeInTheDocument();

      // Apply genre filter for "Action" (first 80 movies)
      await clickToggleFilters(user);
      await clickGenresFilterOption(user, "Action");
      await clickViewResults(user);

      posterList = getPosterList();

      // All 80 Action movies should be visible (less than pagination limit)
      expect(within(posterList).getByText("Movie 001")).toBeInTheDocument();
      expect(within(posterList).getByText("Movie 080")).toBeInTheDocument();

      // Horror movies should not be visible
      expect(
        within(posterList).queryByText("Movie 081"),
      ).not.toBeInTheDocument();

      // Show More button should not be visible (all filtered items fit)
      expect(screen.queryByText("Show More")).not.toBeInTheDocument();
    });

    it("resets pagination when changing sort order", async ({ expect }) => {
      // Create 150 test titles
      const testTitles = Array.from({ length: 150 }, (_, i) =>
        createWatchlistTitle({
          imdbId: `tt${String(i + 1).padStart(7, "0")}`,
          releaseSequence: i + 1,
          releaseYear: String(1950 + Math.floor(i / 3)),
          sortTitle: `Movie ${String(i + 1).padStart(3, "0")}`,
          title: `Movie ${String(i + 1).padStart(3, "0")}`,
        }),
      );

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={testTitles} />);

      // Click Show More to show all items
      await user.click(screen.getByText("Show More"));

      let posterList = getPosterList();
      expect(within(posterList).getByText("Movie 150")).toBeInTheDocument();

      // Change sort order
      await clickSortOption(user, "Release Date (Oldest First)");

      posterList = getPosterList();

      // Should reset to showing first 100 items in new sort order
      expect(within(posterList).getByText("Movie 001")).toBeInTheDocument();

      // Later movies should not be visible (pagination reset)
      expect(
        within(posterList).queryByText("Movie 150"),
      ).not.toBeInTheDocument();

      // Show More button should be visible again
      expect(screen.getByText("Show More")).toBeInTheDocument();
    });

    it("shows correct count of items after multiple Show More clicks", async ({
      expect,
    }) => {
      // Create 250 test titles (requires multiple clicks)
      const testTitles = Array.from({ length: 250 }, (_, i) =>
        createWatchlistTitle({
          imdbId: `tt${String(i + 1).padStart(7, "0")}`,
          sortTitle: `Movie ${String(i + 1).padStart(3, "0")}`,
          title: `Movie ${String(i + 1).padStart(3, "0")}`,
        }),
      );

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={testTitles} />);

      let posterList = getPosterList();

      // Initially shows first 100
      expect(within(posterList).getByText("Movie 100")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Movie 101"),
      ).not.toBeInTheDocument();

      // First click - shows 200
      await user.click(screen.getByText("Show More"));
      posterList = getPosterList();
      expect(within(posterList).getByText("Movie 200")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Movie 201"),
      ).not.toBeInTheDocument();

      // Second click - shows all 250
      await user.click(screen.getByText("Show More"));
      posterList = getPosterList();
      expect(within(posterList).getByText("Movie 250")).toBeInTheDocument();

      // No more Show More button
      expect(screen.queryByText("Show More")).not.toBeInTheDocument();
    });
  });

  describe("filterWatchlistValues", () => {
    let mockValues: WatchlistValue[];

    beforeEach(() => {
      mockValues = [
        {
          genres: ["Horror", "Thriller"],
          imdbId: "tt0000001",
          releaseSequence: 1,
          releaseYear: "2020",
          sortTitle: "Test Title 1",
          title: "Test Title 1",
          watchlistCollectionNames: ["Collection A"],
          watchlistDirectorNames: ["Director A"],
          watchlistPerformerNames: ["Actor A", "Actor B"],
          watchlistWriterNames: ["Writer A"],
        },
        {
          genres: ["Action", "Horror"],
          imdbId: "tt0000002",
          releaseSequence: 2,
          releaseYear: "2021",
          sortTitle: "Test Title 2",
          title: "Test Title 2",
          watchlistCollectionNames: ["Collection B"],
          watchlistDirectorNames: ["Director B"],
          watchlistPerformerNames: ["Actor B", "Actor C"],
          watchlistWriterNames: ["Writer B"],
        },
        {
          genres: ["Comedy"],
          imdbId: "tt0000003",
          releaseSequence: 3,
          releaseYear: "2019",
          sortTitle: "Test Title 3",
          title: "Test Title 3",
          watchlistCollectionNames: ["Collection A", "Collection C"],
          watchlistDirectorNames: ["Director A"],
          watchlistPerformerNames: ["Actor D"],
          watchlistWriterNames: ["Writer A", "Writer C"],
        },
      ];
    });

    describe("calculateGenreCounts", () => {
      it("counts all genres when no filters applied", ({ expect }) => {
        const counts = calculateGenreCounts(mockValues, { genres: [] });

        expect(counts.get("Horror")).toBe(2);
        expect(counts.get("Thriller")).toBe(1);
        expect(counts.get("Action")).toBe(1);
        expect(counts.get("Comedy")).toBe(1);
      });

      it("respects director filter when counting genres", ({ expect }) => {
        const counts = calculateGenreCounts(mockValues, {
          directors: ["Director A"],
          genres: [],
        });

        // Director A has Horror, Thriller, Comedy
        expect(counts.get("Horror")).toBe(1);
        expect(counts.get("Thriller")).toBe(1);
        expect(counts.get("Comedy")).toBe(1);
        expect(counts.get("Action")).toBeUndefined();
      });

      it("respects release year filter when counting genres", ({ expect }) => {
        const counts = calculateGenreCounts(mockValues, {
          genres: [],
          releaseYear: ["2020", "2021"],
        });

        // 2020-2021 has Horror, Thriller, Action
        expect(counts.get("Horror")).toBe(2);
        expect(counts.get("Thriller")).toBe(1);
        expect(counts.get("Action")).toBe(1);
        expect(counts.get("Comedy")).toBeUndefined();
      });

      it("returns empty map when no values match filters", ({ expect }) => {
        const counts = calculateGenreCounts(mockValues, {
          directors: ["Nonexistent Director"],
          genres: [],
        });

        expect(counts.size).toBe(0);
      });

      it("returns empty map when values array is empty", ({ expect }) => {
        const counts = calculateGenreCounts([], { genres: [] });

        expect(counts.size).toBe(0);
      });
    });

    describe("calculateDirectorCounts", () => {
      it("counts all directors when no filters applied", ({ expect }) => {
        const counts = calculateDirectorCounts(mockValues, { genres: [] });

        expect(counts.get("Director A")).toBe(2);
        expect(counts.get("Director B")).toBe(1);
      });

      it("respects genre filter when counting directors", ({ expect }) => {
        const counts = calculateDirectorCounts(mockValues, {
          genres: ["Horror"],
        });

        // Horror titles have Director A and Director B
        expect(counts.get("Director A")).toBe(1);
        expect(counts.get("Director B")).toBe(1);
      });

      it("respects collection filter when counting directors", ({ expect }) => {
        const counts = calculateDirectorCounts(mockValues, {
          collections: ["Collection A"],
          genres: [],
        });

        // Collection A has Director A (appears in 2 titles)
        expect(counts.get("Director A")).toBe(2);
        expect(counts.get("Director B")).toBeUndefined();
      });

      it("returns empty map when no values match filters", ({ expect }) => {
        const counts = calculateDirectorCounts(mockValues, {
          genres: ["Nonexistent"],
        });

        expect(counts.size).toBe(0);
      });
    });

    describe("calculatePerformerCounts", () => {
      it("counts all performers when no filters applied", ({ expect }) => {
        const counts = calculatePerformerCounts(mockValues, { genres: [] });

        expect(counts.get("Actor A")).toBe(1);
        expect(counts.get("Actor B")).toBe(2);
        expect(counts.get("Actor C")).toBe(1);
        expect(counts.get("Actor D")).toBe(1);
      });

      it("respects director filter when counting performers", ({ expect }) => {
        const counts = calculatePerformerCounts(mockValues, {
          directors: ["Director A"],
          genres: [],
        });

        // Director A titles have Actor A, Actor B, Actor D
        expect(counts.get("Actor A")).toBe(1);
        expect(counts.get("Actor B")).toBe(1);
        expect(counts.get("Actor D")).toBe(1);
        expect(counts.get("Actor C")).toBeUndefined();
      });

      it("respects genre filter when counting performers", ({ expect }) => {
        const counts = calculatePerformerCounts(mockValues, {
          genres: ["Horror"],
        });

        // Horror titles have Actor A, Actor B, Actor C
        expect(counts.get("Actor A")).toBe(1);
        expect(counts.get("Actor B")).toBe(2);
        expect(counts.get("Actor C")).toBe(1);
        expect(counts.get("Actor D")).toBeUndefined();
      });
    });

    describe("calculateWriterCounts", () => {
      it("counts all writers when no filters applied", ({ expect }) => {
        const counts = calculateWriterCounts(mockValues, { genres: [] });

        expect(counts.get("Writer A")).toBe(2);
        expect(counts.get("Writer B")).toBe(1);
        expect(counts.get("Writer C")).toBe(1);
      });

      it("respects genre filter when counting writers", ({ expect }) => {
        const counts = calculateWriterCounts(mockValues, {
          genres: ["Horror"],
        });

        // Horror titles have Writer A and Writer B
        expect(counts.get("Writer A")).toBe(1);
        expect(counts.get("Writer B")).toBe(1);
        expect(counts.get("Writer C")).toBeUndefined();
      });

      it("respects performer filter when counting writers", ({ expect }) => {
        const counts = calculateWriterCounts(mockValues, {
          genres: [],
          performers: ["Actor B"],
        });

        // Actor B titles have Writer A and Writer B
        expect(counts.get("Writer A")).toBe(1);
        expect(counts.get("Writer B")).toBe(1);
        expect(counts.get("Writer C")).toBeUndefined();
      });
    });

    describe("calculateCollectionCounts", () => {
      it("counts all collections when no filters applied", ({ expect }) => {
        const counts = calculateCollectionCounts(mockValues, { genres: [] });

        expect(counts.get("Collection A")).toBe(2);
        expect(counts.get("Collection B")).toBe(1);
        expect(counts.get("Collection C")).toBe(1);
      });

      it("respects genre filter when counting collections", ({ expect }) => {
        const counts = calculateCollectionCounts(mockValues, {
          genres: ["Horror"],
        });

        // Horror titles have Collection A and Collection B
        expect(counts.get("Collection A")).toBe(1);
        expect(counts.get("Collection B")).toBe(1);
        expect(counts.get("Collection C")).toBeUndefined();
      });

      it("respects director filter when counting collections", ({ expect }) => {
        const counts = calculateCollectionCounts(mockValues, {
          directors: ["Director A"],
          genres: [],
        });

        // Director A titles have Collection A and Collection C
        expect(counts.get("Collection A")).toBe(2);
        expect(counts.get("Collection C")).toBe(1);
        expect(counts.get("Collection B")).toBeUndefined();
      });

      it("respects multiple filters when counting collections", ({
        expect,
      }) => {
        const counts = calculateCollectionCounts(mockValues, {
          directors: ["Director A"],
          genres: ["Horror"],
        });

        // Director A + Horror = only first title with Collection A
        expect(counts.get("Collection A")).toBe(1);
        expect(counts.get("Collection B")).toBeUndefined();
        expect(counts.get("Collection C")).toBeUndefined();
      });
    });
  });
});
