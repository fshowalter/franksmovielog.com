import { describe, expect, it } from "vitest";

import type { CastAndCrewMemberTitlesFiltersValues } from "./CastAndCrewMemberTitles.reducer";

import { buildAppliedFilterChips } from "./appliedFilterChips";

describe("buildAppliedFilterChips", () => {
  it("returns empty array when no filters active", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {};
    const chips = buildAppliedFilterChips(filterValues);
    expect(chips).toEqual([]);
  });

  it("creates chip for each selected genre", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      genres: ["Horror", "Action"],
    };
    const chips = buildAppliedFilterChips(filterValues);
    expect(chips).toEqual([
      { category: "Genre", id: "genre-horror", label: "Horror" },
      { category: "Genre", id: "genre-action", label: "Action" },
    ]);
  });

  it("creates chip for grade range", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      gradeValue: [11, 10], // Min: A-, Max: B+
    };
    const chips = buildAppliedFilterChips(filterValues);
    expect(chips).toEqual([
      { category: "Grade", id: "gradeValue", label: "B+ to A-" },
    ]);
  });

  it("creates chip for single grade", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      gradeValue: [11, 11], // A- only
    };
    const chips = buildAppliedFilterChips(filterValues);
    expect(chips).toEqual([
      { category: "Grade", id: "gradeValue", label: "A-" },
    ]);
  });

  it("excludes full grade range (1-13)", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      gradeValue: [1, 13], // Full range (F to A+)
    };
    const chips = buildAppliedFilterChips(filterValues);
    expect(chips).toEqual([]);
  });

  it("creates chip for release year range", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      releaseYear: ["1980", "1989"],
    };
    const chips = buildAppliedFilterChips(filterValues);
    expect(chips).toEqual([
      { category: "Release Year", id: "releaseYear", label: "1980-1989" },
    ]);
  });

  it("creates chip for single release year", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      releaseYear: ["1985", "1985"],
    };
    const chips = buildAppliedFilterChips(filterValues);
    expect(chips).toEqual([
      { category: "Release Year", id: "releaseYear", label: "1985" },
    ]);
  });

  it("creates chip for review year range", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      reviewYear: ["2020", "2025"],
    };
    const chips = buildAppliedFilterChips(filterValues);
    expect(chips).toEqual([
      { category: "Review Year", id: "reviewYear", label: "2020-2025" },
    ]);
  });

  it("creates chip for single review year", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      reviewYear: ["2023", "2023"],
    };
    const chips = buildAppliedFilterChips(filterValues);
    expect(chips).toEqual([
      { category: "Review Year", id: "reviewYear", label: "2023" },
    ]);
  });

  it("creates chip for reviewed status (excludes All)", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      reviewedStatus: "Reviewed",
    };
    const chips = buildAppliedFilterChips(filterValues);
    expect(chips).toEqual([
      { category: "Reviewed Status", id: "reviewedStatus", label: "Reviewed" },
    ]);
  });

  it("excludes reviewed status when set to All", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      reviewedStatus: "All",
    };
    const chips = buildAppliedFilterChips(filterValues);
    expect(chips).toEqual([]);
  });

  it("creates chip for credited as", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      creditedAs: "director",
    };
    const chips = buildAppliedFilterChips(filterValues);
    expect(chips).toEqual([
      { category: "Credited As", id: "creditedAs", label: "director" },
    ]);
  });

  it("excludes credited as when undefined", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      creditedAs: undefined,
    };
    const chips = buildAppliedFilterChips(filterValues);
    expect(chips).toEqual([]);
  });

  it("creates chip for title search", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      title: "alien",
    };
    const chips = buildAppliedFilterChips(filterValues);
    expect(chips).toEqual([
      { category: "Search", id: "title", label: "alien" },
    ]);
  });

  it("excludes title search when empty string", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      title: "",
    };
    const chips = buildAppliedFilterChips(filterValues);
    expect(chips).toEqual([]);
  });

  it("excludes title search when only whitespace", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      title: "   ",
    };
    const chips = buildAppliedFilterChips(filterValues);
    expect(chips).toEqual([]);
  });

  it("combines multiple active filters", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      creditedAs: "director",
      genres: ["Horror", "Sci-Fi"],
      gradeValue: [11, 10],
      releaseYear: ["1980", "1989"],
      reviewedStatus: "Not Reviewed",
      reviewYear: ["2020", "2025"],
      title: "alien",
    };
    const chips = buildAppliedFilterChips(filterValues);
    expect(chips).toEqual([
      { category: "Genre", id: "genre-horror", label: "Horror" },
      { category: "Genre", id: "genre-sci-fi", label: "Sci-Fi" },
      { category: "Grade", id: "gradeValue", label: "B+ to A-" },
      { category: "Release Year", id: "releaseYear", label: "1980-1989" },
      { category: "Review Year", id: "reviewYear", label: "2020-2025" },
      {
        category: "Reviewed Status",
        id: "reviewedStatus",
        label: "Not Reviewed",
      },
      { category: "Credited As", id: "creditedAs", label: "director" },
      { category: "Search", id: "title", label: "alien" },
    ]);
  });
});
