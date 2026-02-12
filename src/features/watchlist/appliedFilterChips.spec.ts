import { describe, expect, it } from "vitest";

import type { WatchlistFiltersValues } from "./Watchlist.reducer";

import { buildAppliedFilterChips } from "./appliedFilterChips";

describe("buildAppliedFilterChips", () => {
  it("returns empty array when no filters applied", () => {
    const filterValues: WatchlistFiltersValues = { genres: [] };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([]);
  });

  it("builds genre chips from genres array", () => {
    const filterValues: WatchlistFiltersValues = {
      genres: ["Horror", "Action"],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(2);
    expect(chips[0]).toEqual({
      category: "Genre",
      id: "genre-horror",
      label: "Horror",
    });
    expect(chips[1]).toEqual({
      category: "Genre",
      id: "genre-action",
      label: "Action",
    });
  });

  it("builds release year chip for single year", () => {
    const filterValues: WatchlistFiltersValues = {
      genres: [],
      releaseYear: ["2020", "2020"],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      category: "Release Year",
      id: "releaseYear",
      label: "2020",
    });
  });

  it("builds release year chip for year range", () => {
    const filterValues: WatchlistFiltersValues = {
      genres: [],
      releaseYear: ["1980", "1989"],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      category: "Release Year",
      id: "releaseYear",
      label: "1980-1989",
    });
  });

  it("builds director chip when director selected", () => {
    const filterValues: WatchlistFiltersValues = {
      collection: [],
      director: ["Christopher Nolan"],
      genres: [],
      performer: [],
      writer: [],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      category: "Director",
      id: "director-christopher-nolan",
      label: "Christopher Nolan",
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
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      category: "Performer",
      id: "performer-tom-hanks",
      label: "Tom Hanks",
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
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      category: "Writer",
      id: "writer-aaron-sorkin",
      label: "Aaron Sorkin",
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
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      category: "Collection",
      id: "collection-criterion-collection",
      label: "Criterion Collection",
    });
  });

  it("builds title search chip when title entered", () => {
    const filterValues: WatchlistFiltersValues = {
      genres: [],
      title: "dark knight",
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      category: "Search",
      id: "title",
      label: "dark knight",
    });
  });

  it("does not build title chip for empty string", () => {
    const filterValues: WatchlistFiltersValues = {
      genres: [],
      title: "",
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(0);
  });

  it("does not build title chip for whitespace-only string", () => {
    const filterValues: WatchlistFiltersValues = {
      genres: [],
      title: "   ",
    };
    const chips = buildAppliedFilterChips(filterValues);

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
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(8);
    // Verify order: genres, releaseYear, director, performer, writer, collection, title
    expect(chips[0].category).toBe("Genre");
    expect(chips[0].label).toBe("Horror");
    expect(chips[1].category).toBe("Genre");
    expect(chips[1].label).toBe("Action");
    expect(chips[2].category).toBe("Release Year");
    expect(chips[3].category).toBe("Director");
    expect(chips[4].category).toBe("Performer");
    expect(chips[5].category).toBe("Writer");
    expect(chips[6].category).toBe("Collection");
    expect(chips[7].category).toBe("Search");
  });

  it("handles genre with spaces in name", () => {
    const filterValues: WatchlistFiltersValues = {
      genres: ["Science Fiction"],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      category: "Genre",
      id: "genre-science-fiction",
      label: "Science Fiction",
    });
  });

  it("handles undefined releaseYear", () => {
    const filterValues: WatchlistFiltersValues = {
      genres: [],
      releaseYear: undefined,
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(0);
  });
});
