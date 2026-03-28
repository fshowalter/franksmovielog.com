import { describe, expect, it } from "vitest";

import type { CollectionTitlesFiltersValues } from "./CollectionTitles.reducer";

import { buildAppliedFilterChips } from "./appliedFilterChips";

describe("buildAppliedFilterChips", () => {
  it("returns empty array when no filters applied", () => {
    const filterValues: CollectionTitlesFiltersValues = {};
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([]);
  });

  it("builds chips for genre filters", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      genres: ["Horror", "Action"],
    };
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([
      {
        displayText: "Horror",
        key: "genre-horror",
        value: "Horror",
      },
      {
        displayText: "Action",
        key: "genre-action",
        value: "Action",
      },
    ]);
  });

  it("builds chip for single genre", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      genres: ["Science Fiction"],
    };
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([
      {
        displayText: "Science Fiction",
        key: "genre-science-fiction",
        value: "Science Fiction",
      },
    ]);
  });

  it("builds chip for single grade value", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      gradeValue: [14, 14], // A-
    };
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([
      {
        displayText: "Grade: A-",
        key: "gradeValue",
      },
    ]);
  });

  it("builds chip for grade range", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      gradeValue: [11, 13], // B- to B+
    };
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([
      {
        displayText: "Grade: B- to B+",
        key: "gradeValue",
      },
    ]);
  });

  it("excludes full grade range (2-16) as it is default", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      gradeValue: [2, 16],
    };
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([]);
  });

  it("builds chip for single release year", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      releaseYear: ["1980", "1980"],
    };
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([
      {
        displayText: "Release Year: 1980",
        key: "releaseYear",
      },
    ]);
  });

  it("builds chip for release year range", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      releaseYear: ["1980", "1989"],
    };
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([
      {
        displayText: "Release Year: 1980 to 1989",
        key: "releaseYear",
      },
    ]);
  });

  it("builds chip for single review year", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      reviewYear: ["2020", "2020"],
    };
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([
      {
        displayText: "Review Year: 2020",
        key: "reviewYear",
      },
    ]);
  });

  it("builds chip for review year range", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      reviewYear: ["2020", "2023"],
    };
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([
      {
        displayText: "Review Year: 2020 to 2023",
        key: "reviewYear",
      },
    ]);
  });

  it("does not build release year chip for full default range", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      releaseYear: ["1920", "2024"],
    };
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([]);
  });

  it("does not build review year chip for full default range", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      reviewYear: ["2018", "2024"],
    };
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([]);
  });

  it("does not build year chips when context missing", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      releaseYear: ["2020", "2023"],
      reviewYear: ["2020", "2023"],
    };
    const result = buildAppliedFilterChips(filterValues);
    expect(result).toEqual([]);
  });

  it("builds chip for each selected reviewed status", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      reviewedStatus: ["Reviewed"],
    };
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([
      {
        displayText: "Reviewed",
        key: "reviewedStatus-reviewed",
        value: "Reviewed",
      },
    ]);
  });

  it("builds chips for multiple reviewed statuses", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      reviewedStatus: ["Reviewed", "Not Reviewed"],
    };
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([
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
    const filterValues: CollectionTitlesFiltersValues = {
      reviewedStatus: [],
    };
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([]);
  });

  it("builds chip for title search", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      title: "alien",
    };
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([
      {
        displayText: "Search: alien",
        key: "title",
      },
    ]);
  });

  it("excludes empty title search", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      title: "",
    };
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([]);
  });

  it("excludes whitespace-only title search", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      title: "   ",
    };
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([]);
  });

  it("builds chips for multiple filter types in correct order", () => {
    const filterValues: CollectionTitlesFiltersValues = {
      genres: ["Horror", "Drama"],
      gradeValue: [13, 16], // B+ to A+
      releaseYear: ["1980", "1989"],
      reviewedStatus: ["Reviewed"],
      reviewYear: ["2020", "2023"],
      title: "night",
    };
    const result = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctReviewYears: ["2018", "2024"],
    });
    expect(result).toEqual([
      {
        displayText: "Horror",
        key: "genre-horror",
        value: "Horror",
      },
      {
        displayText: "Drama",
        key: "genre-drama",
        value: "Drama",
      },
      {
        displayText: "Grade: B+ to A+",
        key: "gradeValue",
      },
      {
        displayText: "Release Year: 1980 to 1989",
        key: "releaseYear",
      },
      {
        displayText: "Review Year: 2020 to 2023",
        key: "reviewYear",
      },
      {
        displayText: "Reviewed",
        key: "reviewedStatus-reviewed",
        value: "Reviewed",
      },
      {
        displayText: "Search: night",
        key: "title",
      },
    ]);
  });
});
