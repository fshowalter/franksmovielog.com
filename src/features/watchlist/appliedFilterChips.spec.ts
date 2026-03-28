import { describe, expect, it } from "vitest";

import type { WatchlistFiltersValues } from "./Watchlist.reducer";

import { buildAppliedFilterChips } from "./appliedFilterChips";

describe("buildAppliedFilterChips", () => {
  it("returns empty array when no filters applied", () => {
    const filterValues: WatchlistFiltersValues = { genres: [] };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
    });

    expect(chips).toEqual([]);
  });

  it("builds genre chips from genres array", () => {
    const filterValues: WatchlistFiltersValues = {
      genres: ["Horror", "Action"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
    });

    expect(chips).toHaveLength(2);
    expect(chips[0]).toEqual({
      displayText: "Horror",
      key: "genre-horror",
      value: "Horror",
    });
    expect(chips[1]).toEqual({
      displayText: "Action",
      key: "genre-action",
      value: "Action",
    });
  });

  it("builds release year chip for single year", () => {
    const filterValues: WatchlistFiltersValues = {
      genres: [],
      releaseYear: ["2020", "2020"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
    });

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      displayText: "Release Year: 2020",
      key: "releaseYear",
    });
  });

  it("builds release year chip for year range", () => {
    const filterValues: WatchlistFiltersValues = {
      genres: [],
      releaseYear: ["1980", "1989"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
    });

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      displayText: "Release Year: 1980 to 1989",
      key: "releaseYear",
    });
  });

  it("does not build release year chip for full default range", () => {
    const filterValues: WatchlistFiltersValues = {
      genres: [],
      releaseYear: ["1920", "2024"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
    });

    expect(chips).toHaveLength(0);
  });

  it("does not build release year chip when context missing", () => {
    const filterValues: WatchlistFiltersValues = {
      genres: [],
      releaseYear: ["1980", "1989"],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(0);
  });

  it("builds director chip when director selected", () => {
    const filterValues: WatchlistFiltersValues = {
      collection: [],
      director: ["Christopher Nolan"],
      genres: [],
      performer: [],
      writer: [],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
    });

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      displayText: "Christopher Nolan",
      key: "director-christopher-nolan",
      value: "Christopher Nolan",
    });
  });

  it("builds performer chip when performer selected", () => {
    const filterValues: WatchlistFiltersValues = {
      collection: [],
      director: [],
      genres: [],
      performer: ["Tom Hanks"],
      writer: [],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
    });

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      displayText: "Tom Hanks",
      key: "performer-tom-hanks",
      value: "Tom Hanks",
    });
  });

  it("builds writer chip when writer selected", () => {
    const filterValues: WatchlistFiltersValues = {
      collection: [],
      director: [],
      genres: [],
      performer: [],
      writer: ["Aaron Sorkin"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
    });

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      displayText: "Aaron Sorkin",
      key: "writer-aaron-sorkin",
      value: "Aaron Sorkin",
    });
  });

  it("builds collection chip when collection selected", () => {
    const filterValues: WatchlistFiltersValues = {
      collection: ["Criterion Collection"],
      director: [],
      genres: [],
      performer: [],
      writer: [],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
    });

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      displayText: "Criterion Collection",
      key: "collection-criterion-collection",
      value: "Criterion Collection",
    });
  });

  it("builds title search chip when title entered", () => {
    const filterValues: WatchlistFiltersValues = {
      genres: [],
      title: "dark knight",
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
    });

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      displayText: "Search: dark knight",
      key: "title",
    });
  });

  it("does not build title chip for empty string", () => {
    const filterValues: WatchlistFiltersValues = {
      genres: [],
      title: "",
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
    });

    expect(chips).toHaveLength(0);
  });

  it("does not build title chip for whitespace-only string", () => {
    const filterValues: WatchlistFiltersValues = {
      genres: [],
      title: "   ",
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
    });

    expect(chips).toHaveLength(0);
  });

  it("builds multiple chips for multiple filters", () => {
    const filterValues: WatchlistFiltersValues = {
      collection: ["Criterion Collection"],
      director: ["Christopher Nolan"],
      genres: ["Horror", "Action"],
      performer: ["Tom Hanks"],
      releaseYear: ["1980", "1989"],
      title: "dark knight",
      writer: ["Aaron Sorkin"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
    });

    expect(chips).toHaveLength(8);
    // Verify order: genres, releaseYear, director, performer, writer, collection, title
    expect(chips[0].key).toMatch(/^genre-/);
    expect(chips[0].displayText).toBe("Horror");
    expect(chips[1].key).toMatch(/^genre-/);
    expect(chips[1].displayText).toBe("Action");
    expect(chips[2].key).toBe("releaseYear");
    expect(chips[3].key).toMatch(/^director-/);
    expect(chips[4].key).toMatch(/^performer-/);
    expect(chips[5].key).toMatch(/^writer-/);
    expect(chips[6].key).toMatch(/^collection-/);
    expect(chips[7].key).toBe("title");
  });

  it("handles genre with spaces in name", () => {
    const filterValues: WatchlistFiltersValues = {
      genres: ["Science Fiction"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
    });

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      displayText: "Science Fiction",
      key: "genre-science-fiction",
      value: "Science Fiction",
    });
  });

  it("handles undefined releaseYear", () => {
    const filterValues: WatchlistFiltersValues = {
      genres: [],
      releaseYear: undefined,
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
    });

    expect(chips).toHaveLength(0);
  });
});
