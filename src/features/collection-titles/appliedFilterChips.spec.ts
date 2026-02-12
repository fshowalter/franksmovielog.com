import { describe, expect, it } from "vitest";

import type { CollectionTitlesFiltersValues } from "./CollectionTitles.reducer";

import { buildAppliedFilterChips } from "./appliedFilterChips";

describe("buildAppliedFilterChips", () => {
  it("returns empty array when no filters applied", () => {
    const filterValues: CollectionTitlesFiltersValues = {};
    const result = buildAppliedFilterChips(filterValues);
    expect(result).toEqual([]);
  });

  it("builds chips for genre filters", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      genres: ["Horror", "Action"],
    };
    const result = buildAppliedFilterChips(filterValues);
    expect(result).toEqual([
      {
        category: "Genre",
        id: "genre-horror",
        label: "Horror",
      },
      {
        category: "Genre",
        id: "genre-action",
        label: "Action",
      },
    ]);
  });

  it("builds chip for single genre", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      genres: ["Science Fiction"],
    };
    const result = buildAppliedFilterChips(filterValues);
    expect(result).toEqual([
      {
        category: "Genre",
        id: "genre-science-fiction",
        label: "Science Fiction",
      },
    ]);
  });

  it("builds chip for single grade value", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      gradeValue: [11, 11], // A-
    };
    const result = buildAppliedFilterChips(filterValues);
    expect(result).toEqual([
      {
        category: "Grade",
        id: "gradeValue",
        label: "A-",
      },
    ]);
  });

  it("builds chip for grade range", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      gradeValue: [8, 10], // B- to B+
    };
    const result = buildAppliedFilterChips(filterValues);
    expect(result).toEqual([
      {
        category: "Grade",
        id: "gradeValue",
        label: "B+ to B-",
      },
    ]);
  });

  it("excludes full grade range (1-13) as it is default", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      gradeValue: [1, 13],
    };
    const result = buildAppliedFilterChips(filterValues);
    expect(result).toEqual([]);
  });

  it("builds chip for single release year", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      releaseYear: ["1980", "1980"],
    };
    const result = buildAppliedFilterChips(filterValues);
    expect(result).toEqual([
      {
        category: "Release Year",
        id: "releaseYear",
        label: "1980",
      },
    ]);
  });

  it("builds chip for release year range", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      releaseYear: ["1980", "1989"],
    };
    const result = buildAppliedFilterChips(filterValues);
    expect(result).toEqual([
      {
        category: "Release Year",
        id: "releaseYear",
        label: "1980-1989",
      },
    ]);
  });

  it("builds chip for single review year", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      reviewYear: ["2020", "2020"],
    };
    const result = buildAppliedFilterChips(filterValues);
    expect(result).toEqual([
      {
        category: "Review Year",
        id: "reviewYear",
        label: "2020",
      },
    ]);
  });

  it("builds chip for review year range", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      reviewYear: ["2020", "2023"],
    };
    const result = buildAppliedFilterChips(filterValues);
    expect(result).toEqual([
      {
        category: "Review Year",
        id: "reviewYear",
        label: "2020-2023",
      },
    ]);
  });

  it("builds chip for each selected reviewed status", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      reviewedStatus: ["Reviewed"],
    };
    const result = buildAppliedFilterChips(filterValues);
    expect(result).toEqual([
      {
        category: "Reviewed Status",
        id: "reviewedStatus-reviewed",
        label: "Reviewed",
      },
    ]);
  });

  it("builds chips for multiple reviewed statuses", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      reviewedStatus: ["Reviewed", "Not Reviewed"],
    };
    const result = buildAppliedFilterChips(filterValues);
    expect(result).toEqual([
      {
        category: "Reviewed Status",
        id: "reviewedStatus-reviewed",
        label: "Reviewed",
      },
      {
        category: "Reviewed Status",
        id: "reviewedStatus-not-reviewed",
        label: "Not Reviewed",
      },
    ]);
  });

  it("excludes reviewed status when empty array", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      reviewedStatus: [],
    };
    const result = buildAppliedFilterChips(filterValues);
    expect(result).toEqual([]);
  });

  it("builds chip for title search", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      title: "alien",
    };
    const result = buildAppliedFilterChips(filterValues);
    expect(result).toEqual([
      {
        category: "Search",
        id: "title",
        label: "alien",
      },
    ]);
  });

  it("excludes empty title search", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      title: "",
    };
    const result = buildAppliedFilterChips(filterValues);
    expect(result).toEqual([]);
  });

  it("excludes whitespace-only title search", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      title: "   ",
    };
    const result = buildAppliedFilterChips(filterValues);
    expect(result).toEqual([]);
  });

  it("builds chips for multiple filter types in correct order", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      genres: ["Horror", "Drama"],
      gradeValue: [10, 13], // B+ to A+
      releaseYear: ["1980", "1989"],
      reviewedStatus: ["Reviewed"],
      reviewYear: ["2020", "2023"],
      title: "night",
    };
    const result = buildAppliedFilterChips(filterValues);
    expect(result).toEqual([
      {
        category: "Genre",
        id: "genre-horror",
        label: "Horror",
      },
      {
        category: "Genre",
        id: "genre-drama",
        label: "Drama",
      },
      {
        category: "Grade",
        id: "gradeValue",
        label: "A+ to B+",
      },
      {
        category: "Release Year",
        id: "releaseYear",
        label: "1980-1989",
      },
      {
        category: "Review Year",
        id: "reviewYear",
        label: "2020-2023",
      },
      {
        category: "Reviewed Status",
        id: "reviewedStatus-reviewed",
        label: "Reviewed",
      },
      {
        category: "Search",
        id: "title",
        label: "night",
      },
    ]);
  });
});
