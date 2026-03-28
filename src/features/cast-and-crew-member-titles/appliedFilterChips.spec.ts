import { describe, expect, it } from "vitest";

import type { CastAndCrewMemberTitlesFiltersValues } from "./CastAndCrewMemberTitles.reducer";

import { buildAppliedFilterChips } from "./appliedFilterChips";

describe("buildAppliedFilterChips", () => {
  it("returns empty array when no filters active", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {};
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([]);
  });

  it("creates chip for each selected genre", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      genres: ["Horror", "Action"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([
      { displayText: "Horror", key: "genre-horror", value: "Horror" },
      { displayText: "Action", key: "genre-action", value: "Action" },
    ]);
  });

  it("creates chip for grade range", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      gradeValue: [13, 14], // Min: B+, Max: A-
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([
      { displayText: "Grade: B+ to A-", key: "gradeValue" },
    ]);
  });

  it("creates chip for single grade", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      gradeValue: [14, 14], // A- only
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([{ displayText: "Grade: A-", key: "gradeValue" }]);
  });

  it("excludes full grade range (2-16)", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      gradeValue: [2, 16], // Full range (F- to A+)
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([]);
  });

  it("creates chip for release year range", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      releaseYear: ["1980", "1989"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([
      { displayText: "Release Year: 1980 to 1989", key: "releaseYear" },
    ]);
  });

  it("creates chip for single release year", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      releaseYear: ["1985", "1985"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([
      { displayText: "Release Year: 1985", key: "releaseYear" },
    ]);
  });

  it("creates chip for review year range", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      reviewYear: ["2020", "2025"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([
      { displayText: "Review Year: 2020 to 2025", key: "reviewYear" },
    ]);
  });

  it("creates chip for single review year", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      reviewYear: ["2023", "2023"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([
      { displayText: "Review Year: 2023", key: "reviewYear" },
    ]);
  });

  it("creates chip for each selected reviewed status", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      reviewedStatus: ["Reviewed"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([
      {
        displayText: "Reviewed",
        key: "reviewedStatus-reviewed",
        value: "Reviewed",
      },
    ]);
  });

  it("creates chips for multiple reviewed statuses", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      reviewedStatus: ["Reviewed", "Not Reviewed"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([
      {
        displayText: "Reviewed",
        key: "reviewedStatus-reviewed",
        value: "Reviewed",
      },
      {
        displayText: "Not Reviewed",
        key: "reviewedStatus-not-reviewed",
        value: "Not Reviewed",
      },
    ]);
  });

  it("excludes reviewed status when empty array", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      reviewedStatus: [],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([]);
  });

  it("does not create release year chip for full default range", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      releaseYear: ["1920", "2024"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([]);
  });

  it("does not create review year chip for full default range", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      reviewYear: ["2018", "2024"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([]);
  });

  it("does not create year chips when context missing", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      releaseYear: ["2020", "2023"],
      reviewYear: ["2020", "2023"],
    };
    const chips = buildAppliedFilterChips(filterValues);
    expect(chips).toEqual([]);
  });

  it("creates chip for credited as", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      creditedAs: ["director"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([
      {
        displayText: "Director",
        key: "creditedAs-director",
        value: "director",
      },
    ]);
  });

  it("excludes credited as when undefined", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      creditedAs: undefined,
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([]);
  });

  it("creates chip for title search", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      title: "alien",
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([{ displayText: "Search: alien", key: "title" }]);
  });

  it("excludes title search when empty string", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      title: "",
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([]);
  });

  it("excludes title search when only whitespace", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      title: "   ",
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([]);
  });

  it("combines multiple active filters", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      creditedAs: ["director"],
      genres: ["Horror", "Sci-Fi"],
      gradeValue: [13, 14],
      releaseYear: ["1980", "1989"],
      reviewedStatus: ["Not Reviewed"],
      reviewYear: ["2020", "2025"],
      title: "alien",
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(chips).toEqual([
      { displayText: "Horror", key: "genre-horror", value: "Horror" },
      { displayText: "Sci-Fi", key: "genre-sci-fi", value: "Sci-Fi" },
      { displayText: "Grade: B+ to A-", key: "gradeValue" },
      { displayText: "Release Year: 1980 to 1989", key: "releaseYear" },
      { displayText: "Review Year: 2020 to 2025", key: "reviewYear" },
      {
        displayText: "Not Reviewed",
        key: "reviewedStatus-not-reviewed",
        value: "Not Reviewed",
      },
      {
        displayText: "Director",
        key: "creditedAs-director",
        value: "director",
      },
      { displayText: "Search: alien", key: "title" },
    ]);
  });
});
