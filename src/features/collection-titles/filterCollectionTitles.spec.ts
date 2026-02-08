import { describe, expect, it } from "vitest";

import type { CollectionTitlesValue } from "./CollectionTitles";
import type { CollectionTitlesFiltersValues } from "./CollectionTitles.reducer";

import { calculateGenreCounts } from "./filterCollectionTitles";

const mockTitle = (
  overrides: Partial<CollectionTitlesValue>,
): CollectionTitlesValue => ({
  genres: [],
  gradeValue: 10,
  imdbId: "tt0000000",
  posterImageProps: {
    src: "/poster.jpg",
    srcSet: "",
  },
  releaseSequence: 1,
  releaseYear: "2020",
  reviewDisplayDate: "2023-01-01",
  sortTitle: "Title",
  title: "Title",
  ...overrides,
});

describe("calculateGenreCounts", () => {
  it("returns empty map when no titles provided", () => {
    const filterValues: CollectionTitlesFiltersValues = {};
    const result = calculateGenreCounts([], filterValues);
    expect(result.size).toBe(0);
  });

  it("counts each genre occurrence", () => {
    const titles = [
      mockTitle({ genres: ["Horror", "Drama"] }),
      mockTitle({ genres: ["Horror", "Thriller"] }),
      mockTitle({ genres: ["Drama"] }),
    ];
    const filterValues: CollectionTitlesFiltersValues = {};
    const result = calculateGenreCounts(titles, filterValues);

    expect(result.get("Horror")).toBe(2);
    expect(result.get("Drama")).toBe(2);
    expect(result.get("Thriller")).toBe(1);
  });

  it("respects grade filter when counting genres", () => {
    const titles = [
      mockTitle({ genres: ["Horror"], gradeValue: 10 }), // B+
      mockTitle({ genres: ["Horror"], gradeValue: 12 }), // A
      mockTitle({ genres: ["Drama"], gradeValue: 8 }), // B-
    ];
    const filterValues: CollectionTitlesFiltersValues = {
      gradeValue: [10, 13], // B+ to A+
    };
    const result = calculateGenreCounts(titles, filterValues);

    // Only 2 titles match grade filter (B+ and A)
    expect(result.get("Horror")).toBe(2);
    expect(result.get("Drama")).toBe(undefined); // B- is excluded
  });

  it("respects release year filter when counting genres", () => {
    const titles = [
      mockTitle({ genres: ["Horror"], releaseYear: "1980" }),
      mockTitle({ genres: ["Horror"], releaseYear: "1985" }),
      mockTitle({ genres: ["Drama"], releaseYear: "1990" }),
    ];
    const filterValues: CollectionTitlesFiltersValues = {
      releaseYear: ["1980", "1989"],
    };
    const result = calculateGenreCounts(titles, filterValues);

    expect(result.get("Horror")).toBe(2);
    expect(result.get("Drama")).toBe(undefined); // 1990 is excluded
  });

  it("respects review year filter when counting genres", () => {
    const titles = [
      mockTitle({ genres: ["Horror"], reviewYear: "2020" }),
      mockTitle({ genres: ["Horror"], reviewYear: "2021" }),
      mockTitle({ genres: ["Drama"], reviewYear: "2019" }),
    ];
    const filterValues: CollectionTitlesFiltersValues = {
      reviewYear: ["2020", "2023"],
    };
    const result = calculateGenreCounts(titles, filterValues);

    expect(result.get("Horror")).toBe(2);
    expect(result.get("Drama")).toBe(undefined); // 2019 is excluded
  });

  it("respects reviewed status filter when counting genres", () => {
    const titles = [
      mockTitle({ genres: ["Horror"], slug: "horror-movie" }),
      mockTitle({ genres: ["Horror"], slug: undefined }),
      mockTitle({ genres: ["Drama"], slug: "drama-movie" }),
    ];
    const filterValues: CollectionTitlesFiltersValues = {
      reviewedStatus: "Reviewed",
    };
    const result = calculateGenreCounts(titles, filterValues);

    expect(result.get("Horror")).toBe(1); // Only 1 reviewed Horror
    expect(result.get("Drama")).toBe(1);
  });

  it("excludes genre filter when calculating counts", () => {
    const titles = [
      mockTitle({ genres: ["Horror", "Thriller"] }),
      mockTitle({ genres: ["Drama"] }),
      mockTitle({ genres: ["Action"] }),
    ];
    const filterValues: CollectionTitlesFiltersValues = {
      genres: ["Horror"], // This should be excluded from calculation
    };
    const result = calculateGenreCounts(titles, filterValues);

    // All titles should be counted (genre filter excluded)
    expect(result.get("Horror")).toBe(1);
    expect(result.get("Thriller")).toBe(1);
    expect(result.get("Drama")).toBe(1);
    expect(result.get("Action")).toBe(1);
  });

  it("combines multiple filters when counting genres", () => {
    const titles = [
      mockTitle({
        genres: ["Horror"],
        gradeValue: 12,
        releaseYear: "1980",
        slug: "horror-movie",
      }),
      mockTitle({
        genres: ["Horror"],
        gradeValue: 8,
        releaseYear: "1985",
        slug: "horror-2",
      }),
      mockTitle({
        genres: ["Drama"],
        gradeValue: 11,
        releaseYear: "1983",
        slug: undefined,
      }),
    ];
    const filterValues: CollectionTitlesFiltersValues = {
      gradeValue: [10, 13], // B+ to A+
      releaseYear: ["1980", "1989"],
      reviewedStatus: "Reviewed",
    };
    const result = calculateGenreCounts(titles, filterValues);

    // Only first title matches all filters (A grade, 1980, reviewed)
    expect(result.get("Horror")).toBe(1);
    expect(result.get("Drama")).toBe(undefined); // Not reviewed
  });
});
