import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import {
  clickGenresFilterOption,
  fillReleaseYearFilter,
  fillTitleFilter,
  getTitleFilter,
} from "~/components/filter-and-sort/TitleFilters.testHelper";
import { getGroupedPosterList } from "~/components/poster-list/PosterList.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type { WatchlistProps, WatchlistValue } from "./Watchlist";

import { Watchlist } from "./Watchlist";
import {
  clickCollectionFilterOption,
  clickDirectorFilterOption,
  clickPerformerFilterOption,
  clickWriterFilterOption,
  getDirectorFilter,
} from "./Watchlist.testHelper";

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
    "Leigh Brackett",
    "Jules Furthman",
    "William Faulkner",
    "Frank S. Nugent",
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

  describe("filtering", () => {
    it("filters by title", async ({ expect }) => {
      const testTitles = [
        createWatchlistTitle({ releaseYear: "1959", title: "Rio Bravo" }),
        createWatchlistTitle({
          releaseYear: "1960",
          title: "The Magnificent Seven",
        }),
        createWatchlistTitle({ releaseYear: "1932", title: "Lawyer Man" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={testTitles} />);

      await clickToggleFilters(user);
      await fillTitleFilter(user, "Lawyer");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();

      // Only "Lawyer Man" should be visible in the poster list
      expect(within(posterList).getByText("Lawyer Man")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Rio Bravo"),
      ).not.toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Magnificent Seven"),
      ).not.toBeInTheDocument();
    });

    it("filters by director", async ({ expect }) => {
      const testTitles = [
        createWatchlistTitle({
          title: "Rio Bravo",
          watchlistDirectorNames: ["Howard Hawks"],
        }),
        createWatchlistTitle({
          title: "Red River",
          watchlistDirectorNames: ["Howard Hawks"],
        }),
        createWatchlistTitle({
          title: "The Searchers",
          watchlistDirectorNames: ["John Ford"],
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={testTitles} />);

      await clickToggleFilters(user);
      await clickDirectorFilterOption(user, "Howard Hawks");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();

      // Only Howard Hawks films should be visible
      expect(within(posterList).getByText("Rio Bravo")).toBeInTheDocument();
      expect(within(posterList).getByText("Red River")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Searchers"),
      ).not.toBeInTheDocument();
    });

    it("filters by performer", async ({ expect }) => {
      const testTitles = [
        createWatchlistTitle({
          title: "Rio Bravo",
          watchlistPerformerNames: ["John Wayne", "Dean Martin"],
        }),
        createWatchlistTitle({
          title: "The Searchers",
          watchlistPerformerNames: ["John Wayne"],
        }),
        createWatchlistTitle({
          title: "Some Kind of Wonderful",
          watchlistPerformerNames: ["Eric Stoltz"],
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={testTitles} />);

      await clickToggleFilters(user);
      await clickPerformerFilterOption(user, "John Wayne");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();

      // Only John Wayne films should be visible
      expect(within(posterList).getByText("Rio Bravo")).toBeInTheDocument();
      expect(within(posterList).getByText("The Searchers")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Some Kind of Wonderful"),
      ).not.toBeInTheDocument();
    });

    it("filters by writer", async ({ expect }) => {
      const testTitles = [
        createWatchlistTitle({
          title: "Rio Bravo",
          watchlistWriterNames: ["Leigh Brackett", "Jules Furthman"],
        }),
        createWatchlistTitle({
          title: "The Big Sleep",
          watchlistWriterNames: ["Leigh Brackett", "William Faulkner"],
        }),
        createWatchlistTitle({
          title: "The Searchers",
          watchlistWriterNames: ["Frank S. Nugent"],
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={testTitles} />);

      await clickToggleFilters(user);
      await clickWriterFilterOption(user, "Leigh Brackett");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();

      // Only Leigh Brackett films should be visible
      expect(within(posterList).getByText("Rio Bravo")).toBeInTheDocument();
      expect(within(posterList).getByText("The Big Sleep")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Searchers"),
      ).not.toBeInTheDocument();
    });

    it("filters by collection", async ({ expect }) => {
      const testTitles = [
        createWatchlistTitle({
          title: "Dracula",
          watchlistCollectionNames: ["Universal Monsters"],
        }),
        createWatchlistTitle({
          title: "Frankenstein",
          watchlistCollectionNames: ["Universal Monsters"],
        }),
        createWatchlistTitle({
          title: "The Curse of Frankenstein",
          watchlistCollectionNames: ["Hammer Horror"],
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={testTitles} />);

      await clickToggleFilters(user);
      await clickCollectionFilterOption(user, "Universal Monsters");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();

      // Only Universal Monsters films should be visible
      expect(within(posterList).getByText("Dracula")).toBeInTheDocument();
      expect(within(posterList).getByText("Frankenstein")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Curse of Frankenstein"),
      ).not.toBeInTheDocument();
    });

    it("filters by genres", async ({ expect }) => {
      const testTitles = [
        createWatchlistTitle({
          genres: ["Western", "Drama"],
          title: "Rio Bravo",
        }),
        createWatchlistTitle({
          genres: ["Horror", "Thriller"],
          title: "The Thing",
        }),
        createWatchlistTitle({
          genres: ["Horror", "Thriller"],
          title: "Psycho",
        }),
        createWatchlistTitle({
          genres: ["Comedy"],
          title: "Some Comedy",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={testTitles} />);

      await clickToggleFilters(user);
      await clickGenresFilterOption(user, "Horror");
      await clickGenresFilterOption(user, "Thriller");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();

      // Only Horror/Thriller films should be visible
      expect(within(posterList).getByText("The Thing")).toBeInTheDocument();
      expect(within(posterList).getByText("Psycho")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Rio Bravo"),
      ).not.toBeInTheDocument();
      expect(
        within(posterList).queryByText("Some Comedy"),
      ).not.toBeInTheDocument();
    });

    it("filters by release year range", async ({ expect }) => {
      const testTitles = [
        createWatchlistTitle({ releaseYear: "1959", title: "Rio Bravo" }),
        createWatchlistTitle({ releaseYear: "1982", title: "The Thing" }),
        createWatchlistTitle({ releaseYear: "1979", title: "Alien" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={testTitles} />);

      await clickToggleFilters(user);
      await fillReleaseYearFilter(user, "1970", "1980");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Alien")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Rio Bravo"),
      ).not.toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Thing"),
      ).not.toBeInTheDocument();
    });

    it("combines multiple filter types", async ({ expect }) => {
      const testTitles = [
        createWatchlistTitle({
          genres: ["Western"],
          releaseYear: "1959",
          title: "Rio Bravo",
          watchlistDirectorNames: ["Howard Hawks"],
          watchlistPerformerNames: ["John Wayne"],
        }),
        createWatchlistTitle({
          genres: ["Western"],
          releaseYear: "1967",
          title: "El Dorado",
          watchlistDirectorNames: ["Howard Hawks"],
          watchlistPerformerNames: ["John Wayne"],
        }),
        createWatchlistTitle({
          genres: ["Western"],
          releaseYear: "1956",
          title: "The Searchers",
          watchlistDirectorNames: ["John Ford"],
          watchlistPerformerNames: ["John Wayne"],
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={testTitles} />);

      await clickToggleFilters(user);
      await clickDirectorFilterOption(user, "Howard Hawks");
      await clickPerformerFilterOption(user, "John Wayne");
      await clickViewResults(user);

      const posterList = getGroupedPosterList();

      // Only Hawks films with John Wayne should be visible
      expect(within(posterList).getByText("Rio Bravo")).toBeInTheDocument();
      expect(within(posterList).getByText("El Dorado")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Searchers"),
      ).not.toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("sorts by title A → Z", async ({ expect }) => {
      const titles = [
        createWatchlistTitle({ sortTitle: "Thing", title: "The Thing" }),
        createWatchlistTitle({ sortTitle: "Alien", title: "Alien" }),
        createWatchlistTitle({ sortTitle: "Rio Bravo", title: "Rio Bravo" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={titles} />);

      await clickSortOption(user, "Title (A → Z)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const alienIndex = allText.indexOf("Alien");
      const rioIndex = allText.indexOf("Rio Bravo");
      const thingIndex = allText.indexOf("The Thing");

      expect(alienIndex).toBeLessThan(rioIndex);
      expect(rioIndex).toBeLessThan(thingIndex);
    });

    it("sorts by title Z → A", async ({ expect }) => {
      const titles = [
        createWatchlistTitle({ sortTitle: "Alien", title: "Alien" }),
        createWatchlistTitle({ sortTitle: "Rio Bravo", title: "Rio Bravo" }),
        createWatchlistTitle({ sortTitle: "Thing", title: "The Thing" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={titles} />);

      await clickSortOption(user, "Title (Z → A)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const thingIndex = allText.indexOf("The Thing");
      const rioIndex = allText.indexOf("Rio Bravo");
      const alienIndex = allText.indexOf("Alien");

      expect(thingIndex).toBeLessThan(rioIndex);
      expect(rioIndex).toBeLessThan(alienIndex);
    });

    it("sorts by release date oldest first", async ({ expect }) => {
      const titles = [
        createWatchlistTitle({
          releaseSequence: 3,
          releaseYear: "1982",
          title: "The Thing",
        }),
        createWatchlistTitle({
          releaseSequence: 1,
          releaseYear: "1959",
          title: "Rio Bravo",
        }),
        createWatchlistTitle({
          releaseSequence: 2,
          releaseYear: "1979",
          title: "Alien",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={titles} />);

      await clickSortOption(user, "Release Date (Oldest First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const rioIndex = allText.indexOf("Rio Bravo");
      const alienIndex = allText.indexOf("Alien");
      const thingIndex = allText.indexOf("The Thing");

      expect(rioIndex).toBeLessThan(alienIndex);
      expect(alienIndex).toBeLessThan(thingIndex);
    });

    it("sorts by release date newest first", async ({ expect }) => {
      const titles = [
        createWatchlistTitle({
          releaseSequence: 1,
          releaseYear: "1959",
          title: "Rio Bravo",
        }),
        createWatchlistTitle({
          releaseSequence: 2,
          releaseYear: "1979",
          title: "Alien",
        }),
        createWatchlistTitle({
          releaseSequence: 3,
          releaseYear: "1982",
          title: "The Thing",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={titles} />);

      await clickSortOption(user, "Release Date (Newest First)");

      const posterList = getGroupedPosterList();
      const allText = posterList.textContent || "";
      const thingIndex = allText.indexOf("The Thing");
      const alienIndex = allText.indexOf("Alien");
      const rioIndex = allText.indexOf("Rio Bravo");

      expect(thingIndex).toBeLessThan(alienIndex);
      expect(alienIndex).toBeLessThan(rioIndex);
    });
  });

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

      const posterList = getGroupedPosterList();
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

  describe("when adding filters incrementally", () => {
    it("narrows results with each additional filter", async ({ expect }) => {
      const testTitles = [
        createWatchlistTitle({
          genres: ["Western"],
          releaseYear: "1959",
          title: "Rio Bravo",
          watchlistDirectorNames: ["Howard Hawks"],
        }),
        createWatchlistTitle({
          genres: ["Horror"],
          releaseYear: "1982",
          title: "The Thing",
          watchlistDirectorNames: ["John Carpenter"],
        }),
        createWatchlistTitle({
          genres: ["Action", "Comedy"],
          releaseYear: "1986",
          title: "Big Trouble in Little China",
          watchlistDirectorNames: ["John Carpenter"],
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={testTitles} />);

      // Apply director filter first
      await clickToggleFilters(user);
      await clickDirectorFilterOption(user, "John Carpenter");
      await clickViewResults(user);

      let posterList = getGroupedPosterList();
      expect(within(posterList).getByText("The Thing")).toBeInTheDocument();
      expect(
        within(posterList).getByText("Big Trouble in Little China"),
      ).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Rio Bravo"),
      ).not.toBeInTheDocument();

      // Add genre filter on top
      await clickToggleFilters(user);
      await clickGenresFilterOption(user, "Horror");
      await clickViewResults(user);

      posterList = getGroupedPosterList();
      expect(within(posterList).getByText("The Thing")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Big Trouble in Little China"),
      ).not.toBeInTheDocument();
      expect(
        within(posterList).queryByText("Rio Bravo"),
      ).not.toBeInTheDocument();
    });
  });

  describe("when clearing filters", () => {
    it("clears all filters with clear button", async ({ expect }) => {
      const testTitles = [
        createWatchlistTitle({
          title: "Rio Bravo",
          watchlistDirectorNames: ["Howard Hawks"],
        }),
        createWatchlistTitle({
          title: "The Thing",
          watchlistDirectorNames: ["John Carpenter"],
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={testTitles} />);

      // Apply multiple filters
      await clickToggleFilters(user);
      await fillTitleFilter(user, "Thing");
      await clickDirectorFilterOption(user, "John Carpenter");
      await clickViewResults(user);

      // Verify filters are applied
      let posterList = getGroupedPosterList();
      expect(within(posterList).getByText("The Thing")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Rio Bravo"),
      ).not.toBeInTheDocument();

      // Clear filters
      await clickToggleFilters(user);
      await clickClearFilters(user);

      // Check that all filters are cleared
      expect(getTitleFilter()).toHaveValue("");
      expect(getDirectorFilter()).toHaveValue("All");

      await clickViewResults(user);

      // All titles should be visible again
      posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Rio Bravo")).toBeInTheDocument();
      expect(within(posterList).getByText("The Thing")).toBeInTheDocument();
    });
  });

  describe("when closing filter drawer without applying", () => {
    it("resets pending filter changes", async ({ expect }) => {
      const testTitles = [
        createWatchlistTitle({ title: "Rio Bravo" }),
        createWatchlistTitle({ title: "The Thing" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Watchlist {...baseProps} values={testTitles} />);

      // Apply initial filter
      await clickToggleFilters(user);
      await fillTitleFilter(user, "Rio");
      await clickViewResults(user);

      // Verify filter is applied
      let posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Rio Bravo")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Thing"),
      ).not.toBeInTheDocument();

      // Start typing new filter but close without applying
      await clickToggleFilters(user);
      await fillTitleFilter(user, "Thing");
      await clickCloseFilters(user); // Close without clicking "View Results"

      // Original filter should still be active
      posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Rio Bravo")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("The Thing"),
      ).not.toBeInTheDocument();

      // Verify original filter value is preserved
      await clickToggleFilters(user);
      expect(getTitleFilter()).toHaveValue("Rio");
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

      const posterList = getGroupedPosterList();

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

      const posterList = getGroupedPosterList();

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

      let posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Movie 150")).toBeInTheDocument();

      // Apply genre filter for "Action" (first 80 movies)
      await clickToggleFilters(user);
      await clickGenresFilterOption(user, "Action");
      await clickViewResults(user);

      posterList = getGroupedPosterList();

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

      let posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Movie 150")).toBeInTheDocument();

      // Change sort order
      await clickSortOption(user, "Release Date (Oldest First)");

      posterList = getGroupedPosterList();

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

      let posterList = getGroupedPosterList();

      // Initially shows first 100
      expect(within(posterList).getByText("Movie 100")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Movie 101"),
      ).not.toBeInTheDocument();

      // First click - shows 200
      await user.click(screen.getByText("Show More"));
      posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Movie 200")).toBeInTheDocument();
      expect(
        within(posterList).queryByText("Movie 201"),
      ).not.toBeInTheDocument();

      // Second click - shows all 250
      await user.click(screen.getByText("Show More"));
      posterList = getGroupedPosterList();
      expect(within(posterList).getByText("Movie 250")).toBeInTheDocument();

      // No more Show More button
      expect(screen.queryByText("Show More")).not.toBeInTheDocument();
    });
  });
});
