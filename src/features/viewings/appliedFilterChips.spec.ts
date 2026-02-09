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
    const chips = buildAppliedFilterChips(filterValues);

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
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([
      {
        category: "Release Year",
        id: "releaseYear",
        label: "2022",
      },
    ]);
  });

  it("creates chip for reviewed status when not All", () => {
    const filterValues: ViewingsFiltersValues = {
      reviewedStatus: "Reviewed",
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([
      {
        category: "Reviewed Status",
        id: "reviewedStatus",
        label: "Reviewed",
      },
    ]);
  });

  it("excludes reviewed status chip when value is All", () => {
    const filterValues: ViewingsFiltersValues = {
      reviewedStatus: "All",
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([]);
  });

  it("creates chip for viewing year range", () => {
    const filterValues: ViewingsFiltersValues = {
      viewingYear: ["2023", "2024"],
    };
    const chips = buildAppliedFilterChips(filterValues);

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
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([
      {
        category: "Viewing Year",
        id: "viewingYear",
        label: "2024",
      },
    ]);
  });

  it("creates chip for medium when not All", () => {
    const filterValues: ViewingsFiltersValues = {
      medium: "Blu-ray",
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([
      {
        category: "Medium",
        id: "medium",
        label: "Blu-ray",
      },
    ]);
  });

  it("excludes medium chip when value is All", () => {
    const filterValues: ViewingsFiltersValues = {
      medium: "All",
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([]);
  });

  it("creates chip for venue when not All", () => {
    const filterValues: ViewingsFiltersValues = {
      venue: "Home",
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([
      {
        category: "Venue",
        id: "venue",
        label: "Home",
      },
    ]);
  });

  it("excludes venue chip when value is All", () => {
    const filterValues: ViewingsFiltersValues = {
      venue: "All",
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
      medium: "4K UHD",
      releaseYear: ["2020", "2023"],
      reviewedStatus: "Not Reviewed",
      title: "dark knight",
      venue: "Theater",
      viewingYear: ["2024", "2024"],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([
      {
        category: "Release Year",
        id: "releaseYear",
        label: "2020-2023",
      },
      {
        category: "Reviewed Status",
        id: "reviewedStatus",
        label: "Not Reviewed",
      },
      {
        category: "Viewing Year",
        id: "viewingYear",
        label: "2024",
      },
      {
        category: "Medium",
        id: "medium",
        label: "4K UHD",
      },
      {
        category: "Venue",
        id: "venue",
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
      medium: "Streaming",
      releaseYear: ["2020", "2022"],
      reviewedStatus: "Reviewed",
      title: "test",
      venue: "Home",
      viewingYear: ["2023", "2024"],
    };
    const chips = buildAppliedFilterChips(filterValues);

    // Expect consistent order: releaseYear, reviewedStatus, viewingYear, medium, venue, title
    expect(chips.map((chip) => chip.id)).toEqual([
      "releaseYear",
      "reviewedStatus",
      "viewingYear",
      "medium",
      "venue",
      "title",
    ]);
  });
});
