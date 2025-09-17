import type { ReviewsValue } from "./ReviewsListItem";

// Shared test helper for all review feature specs
let testIdCounter = 0;

export function createReviewValue(
  overrides: Partial<ReviewsValue> = {},
): ReviewsValue {
  testIdCounter += 1;
  return {
    genres: ["Drama"],
    grade: "B",
    gradeValue: 9,
    imdbId: `tt${String(testIdCounter).padStart(7, "0")}`,
    posterImageProps: {
      src: "/poster.jpg",
      srcSet: "/poster.jpg 1x",
    },
    releaseSequence: testIdCounter,
    releaseYear: "1970",
    reviewDisplayDate: "Jan 1, 2020",
    reviewMonth: "January",
    reviewSequence: testIdCounter,
    reviewYear: "2020",
    slug: `test-movie-${testIdCounter}`,
    sortTitle: `Test Movie ${testIdCounter}`,
    title: `Test Movie ${testIdCounter}`,
    ...overrides,
  };
}

export function resetTestIdCounter(): void {
  testIdCounter = 0;
}

export const baseReviewProps = {
  distinctGenres: ["Drama", "Horror", "Thriller", "Action", "Comedy", "Sci-Fi"],
  distinctReleaseYears: ["1960", "1970", "1980", "1990", "2000", "2010", "2020"],
  distinctReviewYears: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
  initialSort: "review-date-desc" as const,
  values: [],
};