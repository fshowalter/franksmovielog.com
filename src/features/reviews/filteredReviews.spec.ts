import { describe, expect, it } from "vitest";

import type { ReviewsValue } from "./ReviewsListItem";

import {
  calculateGenreCounts,
  calculateGradeCounts,
  calculateReleaseYearCounts,
  calculateReviewYearCounts,
  filterReviews,
} from "./filteredReviews";

// Helper to create mock review data
function createMockReview(overrides: Partial<ReviewsValue>): ReviewsValue {
  return {
    genres: ["Drama"],
    grade: "B+",
    gradeValue: 8,
    imdbId: "tt0000001",
    posterImageProps: {
      src: "/posters/test.png",
      srcSet: "/posters/test.png",
    },
    releaseSequence: 1,
    releaseYear: "2020",
    reviewDisplayDate: "Jan 1, 2021",
    reviewMonth: undefined,
    reviewSequence: 1,
    reviewYear: "2021",
    slug: "test-movie-2020",
    sortTitle: "Test Movie",
    title: "Test Movie",
    ...overrides,
  };
}

describe("filterReviews", () => {
  it("returns all reviews when no filters applied", () => {
    const reviews = [
      createMockReview({ slug: "movie-1" }),
      createMockReview({ slug: "movie-2" }),
    ];

    const result = filterReviews(reviews, {});

    expect(result).toHaveLength(2);
  });

  it("filters by genre", () => {
    const reviews = [
      createMockReview({ genres: ["Action"], slug: "movie-1" }),
      createMockReview({ genres: ["Drama"], slug: "movie-2" }),
      createMockReview({ genres: ["Action", "Drama"], slug: "movie-3" }),
    ];

    const result = filterReviews(reviews, { genres: ["Action"] });

    expect(result).toHaveLength(2);
    expect(result[0].slug).toBe("movie-1");
    expect(result[1].slug).toBe("movie-3");
  });

  it("filters by grade range", () => {
    const reviews = [
      createMockReview({ gradeValue: 6, slug: "movie-1" }),
      createMockReview({ gradeValue: 8, slug: "movie-2" }),
      createMockReview({ gradeValue: 10, slug: "movie-3" }),
    ];

    const result = filterReviews(reviews, { gradeValue: [7, 9] });

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("movie-2");
  });

  it("filters by release year range", () => {
    const reviews = [
      createMockReview({ releaseYear: "2018", slug: "movie-1" }),
      createMockReview({ releaseYear: "2020", slug: "movie-2" }),
      createMockReview({ releaseYear: "2022", slug: "movie-3" }),
    ];

    const result = filterReviews(reviews, {
      releaseYear: ["2019", "2021"],
    });

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("movie-2");
  });

  it("filters by review year range", () => {
    const reviews = [
      createMockReview({ reviewYear: "2018", slug: "movie-1" }),
      createMockReview({ reviewYear: "2020", slug: "movie-2" }),
      createMockReview({ reviewYear: "2022", slug: "movie-3" }),
    ];

    const result = filterReviews(reviews, {
      reviewYear: ["2019", "2021"],
    });

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("movie-2");
  });

  it("applies multiple filters together", () => {
    const reviews = [
      createMockReview({
        genres: ["Action"],
        gradeValue: 8,
        releaseYear: "2020",
        slug: "movie-1",
      }),
      createMockReview({
        genres: ["Drama"],
        gradeValue: 8,
        releaseYear: "2020",
        slug: "movie-2",
      }),
      createMockReview({
        genres: ["Action"],
        gradeValue: 6,
        releaseYear: "2020",
        slug: "movie-3",
      }),
    ];

    const result = filterReviews(reviews, {
      genres: ["Action"],
      gradeValue: [7, 10],
    });

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("movie-1");
  });
});

describe("calculateGenreCounts", () => {
  it("counts all genres when no filters applied", () => {
    const reviews = [
      createMockReview({ genres: ["Action"] }),
      createMockReview({ genres: ["Drama"] }),
      createMockReview({ genres: ["Action", "Drama"] }),
    ];

    const counts = calculateGenreCounts(reviews, {});

    expect(counts.get("Action")).toBe(2);
    expect(counts.get("Drama")).toBe(2);
  });

  it("counts genres respecting grade filter", () => {
    const reviews = [
      createMockReview({ genres: ["Action"], gradeValue: 8 }),
      createMockReview({ genres: ["Drama"], gradeValue: 6 }),
      createMockReview({ genres: ["Action", "Drama"], gradeValue: 8 }),
    ];

    const counts = calculateGenreCounts(reviews, {
      gradeValue: [7, 10],
    });

    expect(counts.get("Action")).toBe(2);
    expect(counts.get("Drama")).toBe(1);
  });

  it("counts genres respecting release year filter", () => {
    const reviews = [
      createMockReview({ genres: ["Action"], releaseYear: "2020" }),
      createMockReview({ genres: ["Drama"], releaseYear: "2018" }),
      createMockReview({ genres: ["Action"], releaseYear: "2022" }),
    ];

    const counts = calculateGenreCounts(reviews, {
      releaseYear: ["2019", "2021"],
    });

    expect(counts.get("Action")).toBe(1);
    expect(counts.get("Drama")).toBeUndefined();
  });

  it("ignores genre filter when calculating genre counts", () => {
    const reviews = [
      createMockReview({ genres: ["Action"] }),
      createMockReview({ genres: ["Drama"] }),
      createMockReview({ genres: ["Action", "Drama"] }),
    ];

    // Even though we filter by Action, counts should show all genres
    const counts = calculateGenreCounts(reviews, {
      genres: ["Action"],
    });

    expect(counts.get("Action")).toBe(2);
    expect(counts.get("Drama")).toBe(2);
  });

  it("returns empty map when no reviews", () => {
    const counts = calculateGenreCounts([], {});

    expect(counts.size).toBe(0);
  });
});

describe("calculateReleaseYearCounts", () => {
  it("calculates year range when no filters applied", () => {
    const reviews = [
      createMockReview({ releaseYear: "2018" }),
      createMockReview({ releaseYear: "2020" }),
      createMockReview({ releaseYear: "2022" }),
    ];

    const result = calculateReleaseYearCounts(reviews, {});

    expect(result.min).toBe(2018);
    expect(result.max).toBe(2022);
    expect(result.yearCounts.get(2018)).toBe(1);
    expect(result.yearCounts.get(2020)).toBe(1);
    expect(result.yearCounts.get(2022)).toBe(1);
  });

  it("respects genre filter when calculating year range", () => {
    const reviews = [
      createMockReview({ genres: ["Action"], releaseYear: "2018" }),
      createMockReview({ genres: ["Drama"], releaseYear: "2020" }),
      createMockReview({ genres: ["Action"], releaseYear: "2022" }),
    ];

    const result = calculateReleaseYearCounts(reviews, {
      genres: ["Action"],
    });

    expect(result.min).toBe(2018);
    expect(result.max).toBe(2022);
    expect(result.yearCounts.get(2018)).toBe(1);
    expect(result.yearCounts.get(2020)).toBeUndefined();
    expect(result.yearCounts.get(2022)).toBe(1);
  });

  it("ignores release year filter when calculating year counts", () => {
    const reviews = [
      createMockReview({ releaseYear: "2018" }),
      createMockReview({ releaseYear: "2020" }),
      createMockReview({ releaseYear: "2022" }),
    ];

    const result = calculateReleaseYearCounts(reviews, {
      releaseYear: ["2019", "2021"],
    });

    expect(result.min).toBe(2018);
    expect(result.max).toBe(2022);
    expect(result.yearCounts.size).toBe(3);
  });

  it("handles multiple reviews in same year", () => {
    const reviews = [
      createMockReview({ releaseYear: "2020", slug: "movie-1" }),
      createMockReview({ releaseYear: "2020", slug: "movie-2" }),
      createMockReview({ releaseYear: "2021", slug: "movie-3" }),
    ];

    const result = calculateReleaseYearCounts(reviews, {});

    expect(result.yearCounts.get(2020)).toBe(2);
    expect(result.yearCounts.get(2021)).toBe(1);
  });

  it("returns zeros when no reviews", () => {
    const result = calculateReleaseYearCounts([], {});

    expect(result.min).toBe(0);
    expect(result.max).toBe(0);
    expect(result.yearCounts.size).toBe(0);
  });

  it("handles invalid year strings gracefully", () => {
    const reviews = [
      createMockReview({ releaseYear: "2020" }),
      createMockReview({ releaseYear: "invalid" }),
      createMockReview({ releaseYear: "2022" }),
    ];

    const result = calculateReleaseYearCounts(reviews, {});

    expect(result.min).toBe(2020);
    expect(result.max).toBe(2022);
    expect(result.yearCounts.size).toBe(2);
  });
});

describe("calculateReviewYearCounts", () => {
  it("calculates year range when no filters applied", () => {
    const reviews = [
      createMockReview({ reviewYear: "2019" }),
      createMockReview({ reviewYear: "2021" }),
      createMockReview({ reviewYear: "2023" }),
    ];

    const result = calculateReviewYearCounts(reviews, {});

    expect(result.min).toBe(2019);
    expect(result.max).toBe(2023);
    expect(result.yearCounts.get(2019)).toBe(1);
    expect(result.yearCounts.get(2021)).toBe(1);
    expect(result.yearCounts.get(2023)).toBe(1);
  });

  it("respects genre filter when calculating review year range", () => {
    const reviews = [
      createMockReview({ genres: ["Action"], reviewYear: "2019" }),
      createMockReview({ genres: ["Drama"], reviewYear: "2021" }),
      createMockReview({ genres: ["Action"], reviewYear: "2023" }),
    ];

    const result = calculateReviewYearCounts(reviews, {
      genres: ["Action"],
    });

    expect(result.min).toBe(2019);
    expect(result.max).toBe(2023);
    expect(result.yearCounts.get(2019)).toBe(1);
    expect(result.yearCounts.get(2021)).toBeUndefined();
    expect(result.yearCounts.get(2023)).toBe(1);
  });

  it("ignores review year filter when calculating year counts", () => {
    const reviews = [
      createMockReview({ reviewYear: "2019" }),
      createMockReview({ reviewYear: "2021" }),
      createMockReview({ reviewYear: "2023" }),
    ];

    const result = calculateReviewYearCounts(reviews, {
      reviewYear: ["2020", "2022"],
    });

    expect(result.min).toBe(2019);
    expect(result.max).toBe(2023);
    expect(result.yearCounts.size).toBe(3);
  });

  it("returns zeros when no reviews", () => {
    const result = calculateReviewYearCounts([], {});

    expect(result.min).toBe(0);
    expect(result.max).toBe(0);
    expect(result.yearCounts.size).toBe(0);
  });
});

describe("calculateGradeCounts", () => {
  it("calculates grade range when no filters applied", () => {
    const reviews = [
      createMockReview({ gradeValue: 6 }),
      createMockReview({ gradeValue: 8 }),
      createMockReview({ gradeValue: 10 }),
    ];

    const result = calculateGradeCounts(reviews, {});

    expect(result.min).toBe(6);
    expect(result.max).toBe(10);
    expect(result.gradeCounts.get(6)).toBe(1);
    expect(result.gradeCounts.get(8)).toBe(1);
    expect(result.gradeCounts.get(10)).toBe(1);
  });

  it("respects genre filter when calculating grade range", () => {
    const reviews = [
      createMockReview({ genres: ["Action"], gradeValue: 6 }),
      createMockReview({ genres: ["Drama"], gradeValue: 8 }),
      createMockReview({ genres: ["Action"], gradeValue: 10 }),
    ];

    const result = calculateGradeCounts(reviews, {
      genres: ["Action"],
    });

    expect(result.min).toBe(6);
    expect(result.max).toBe(10);
    expect(result.gradeCounts.get(6)).toBe(1);
    expect(result.gradeCounts.get(8)).toBeUndefined();
    expect(result.gradeCounts.get(10)).toBe(1);
  });

  it("ignores grade filter when calculating grade counts", () => {
    const reviews = [
      createMockReview({ gradeValue: 6 }),
      createMockReview({ gradeValue: 8 }),
      createMockReview({ gradeValue: 10 }),
    ];

    const result = calculateGradeCounts(reviews, {
      gradeValue: [7, 9],
    });

    expect(result.min).toBe(6);
    expect(result.max).toBe(10);
    expect(result.gradeCounts.size).toBe(3);
  });

  it("handles multiple reviews with same grade", () => {
    const reviews = [
      createMockReview({ gradeValue: 8, slug: "movie-1" }),
      createMockReview({ gradeValue: 8, slug: "movie-2" }),
      createMockReview({ gradeValue: 9, slug: "movie-3" }),
    ];

    const result = calculateGradeCounts(reviews, {});

    expect(result.gradeCounts.get(8)).toBe(2);
    expect(result.gradeCounts.get(9)).toBe(1);
  });

  it("returns zeros when no reviews", () => {
    const result = calculateGradeCounts([], {});

    expect(result.min).toBe(0);
    expect(result.max).toBe(0);
    expect(result.gradeCounts.size).toBe(0);
  });
});
