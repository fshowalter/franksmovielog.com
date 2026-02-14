import { describe, expect, it } from "vitest";

import type { ViewingsFiltersValues } from "./Viewings.reducer";

import { buildAppliedFilterChips } from "./appliedFilterChips";

describe("buildAppliedFilterChips", () => {
  it("returns empty array when no filters are active", () => {
    const filterValues: ViewingsFiltersValues = {};
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([]);
  });

  it("creates chip for release year range", () => {
    const filterValues: ViewingsFiltersValues = {
      releaseYear: ["2020", "2023"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
    });

    expect(chips).toEqual([
      {
        category: "Release Year",
        id: "releaseYear",
        label: "2020-2023",
      },
    ]);
  });

  it("creates chip for single release year", () => {
    const filterValues: ViewingsFiltersValues = {
      releaseYear: ["2022", "2022"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
    });

    expect(chips).toEqual([
      {
        category: "Release Year",
        id: "releaseYear",
        label: "2022",
      },
    ]);
  });

  it("does not create chip for release year full default range", () => {
    const filterValues: ViewingsFiltersValues = {
      releaseYear: ["1920", "2024"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
    });

    expect(chips).toEqual([]);
  });

  it("does not create chip for release year when context missing", () => {
    const filterValues: ViewingsFiltersValues = {
      releaseYear: ["2020", "2023"],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([]);
  });

  it("creates chip for each reviewed status value", () => {
    const filterValues: ViewingsFiltersValues = {
      reviewedStatus: ["Reviewed"],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([
      {
        category: "Reviewed Status",
        id: "reviewedStatus-reviewed",
        label: "Reviewed",
      },
    ]);
  });

  it("excludes reviewed status chip when empty array", () => {
    const filterValues: ViewingsFiltersValues = {
      reviewedStatus: [],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([]);
  });

  it("creates chip for viewing year range", () => {
    const filterValues: ViewingsFiltersValues = {
      viewingYear: ["2023", "2024"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctViewingYears: ["2020", "2024"],
    });

    expect(chips).toEqual([
      {
        category: "Viewing Year",
        id: "viewingYear",
        label: "2023-2024",
      },
    ]);
  });

  it("creates chip for single viewing year", () => {
    const filterValues: ViewingsFiltersValues = {
      viewingYear: ["2024", "2024"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctViewingYears: ["2020", "2024"],
    });

    expect(chips).toEqual([
      {
        category: "Viewing Year",
        id: "viewingYear",
        label: "2024",
      },
    ]);
  });

  it("does not create chip for viewing year full default range", () => {
    const filterValues: ViewingsFiltersValues = {
      viewingYear: ["2020", "2024"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctViewingYears: ["2020", "2024"],
    });

    expect(chips).toEqual([]);
  });

  it("does not create chip for viewing year when context missing", () => {
    const filterValues: ViewingsFiltersValues = {
      viewingYear: ["2023", "2024"],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([]);
  });

  it("creates chips for each medium value", () => {
    const filterValues: ViewingsFiltersValues = {
      medium: ["Blu-ray", "DVD"],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([
      {
        category: "Medium",
        id: "medium-blu-ray",
        label: "Blu-ray",
      },
      {
        category: "Medium",
        id: "medium-dvd",
        label: "DVD",
      },
    ]);
  });

  it("excludes medium chips when array is empty", () => {
    const filterValues: ViewingsFiltersValues = {
      medium: [],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([]);
  });

  it("creates chips for each venue value", () => {
    const filterValues: ViewingsFiltersValues = {
      venue: ["Home", "Theater"],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([
      {
        category: "Venue",
        id: "venue-home",
        label: "Home",
      },
      {
        category: "Venue",
        id: "venue-theater",
        label: "Theater",
      },
    ]);
  });

  it("excludes venue chips when array is empty", () => {
    const filterValues: ViewingsFiltersValues = {
      venue: [],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([]);
  });

  it("creates chip for title search", () => {
    const filterValues: ViewingsFiltersValues = {
      title: "alien",
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([
      {
        category: "Search",
        id: "title",
        label: "alien",
      },
    ]);
  });

  it("excludes title chip when value is whitespace only", () => {
    const filterValues: ViewingsFiltersValues = {
      title: "   ",
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([]);
  });

  it("creates multiple chips for multiple active filters", () => {
    const filterValues: ViewingsFiltersValues = {
      medium: ["4K UHD"],
      releaseYear: ["2020", "2023"],
      reviewedStatus: ["Not Reviewed"],
      title: "dark knight",
      venue: ["Theater"],
      viewingYear: ["2024", "2024"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctViewingYears: ["2020", "2024"],
    });

    expect(chips).toEqual([
      {
        category: "Release Year",
        id: "releaseYear",
        label: "2020-2023",
      },
      {
        category: "Reviewed Status",
        id: "reviewedStatus-not-reviewed",
        label: "Not Reviewed",
      },
      {
        category: "Viewing Year",
        id: "viewingYear",
        label: "2024",
      },
      {
        category: "Medium",
        id: "medium-4k-uhd",
        label: "4K UHD",
      },
      {
        category: "Venue",
        id: "venue-theater",
        label: "Theater",
      },
      {
        category: "Search",
        id: "title",
        label: "dark knight",
      },
    ]);
  });

  it("maintains consistent chip ordering", () => {
    // Test with filters added in different order
    const filterValues: ViewingsFiltersValues = {
      medium: ["Streaming"],
      releaseYear: ["2020", "2022"],
      reviewedStatus: ["Reviewed"],
      title: "test",
      venue: ["Home"],
      viewingYear: ["2023", "2024"],
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctViewingYears: ["2020", "2024"],
    });

    // Expect consistent order: releaseYear, reviewedStatus, viewingYear, medium, venue, title
    expect(chips.map((chip) => chip.id)).toEqual([
      "releaseYear",
      "reviewedStatus-reviewed",
      "viewingYear",
      "medium-streaming",
      "venue-home",
      "title",
    ]);
  });

  it("excludes default year ranges from combined filters", () => {
    const filterValues: ViewingsFiltersValues = {
      medium: ["DVD"],
      releaseYear: ["1920", "2024"], // Full range
      venue: ["Home"],
      viewingYear: ["2020", "2024"], // Full range
    };
    const chips = buildAppliedFilterChips(filterValues, {
      distinctReleaseYears: ["1920", "2024"],
      distinctViewingYears: ["2020", "2024"],
    });

    expect(chips).toEqual([
      {
        category: "Medium",
        id: "medium-dvd",
        label: "DVD",
      },
      {
        category: "Venue",
        id: "venue-home",
        label: "Home",
      },
    ]);
  });
});
