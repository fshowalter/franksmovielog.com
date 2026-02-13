import { describe, expect, it } from "vitest";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type { CastAndCrewMemberTitlesFiltersValues } from "./CastAndCrewMemberTitles.reducer";

import {
  calculateGenreCounts,
  calculateReviewedStatusCounts,
} from "./filterCastAndCrewMemberTitles";

describe("calculateGenreCounts", () => {
  const mockValues: CastAndCrewMemberTitlesValue[] = [
    {
      creditedAs: ["director"],
      excerpt: undefined,
      genres: ["Horror", "Thriller"],
      grade: "A",
      gradeValue: 12,
      imdbId: "tt1",
      releaseSequence: 1,
      releaseYear: "1980",
      reviewDisplayDate: "Jan 1, 2020",
      reviewSequence: 1,
      reviewYear: "2020",
      slug: "test-1",
      sortTitle: "test 1",
      stillImageProps: {} as never,
      title: "Test 1",
      watchlistCollectionNames: [],
      watchlistDirectorNames: [],
      watchlistPerformerNames: [],
      watchlistWriterNames: [],
    },
    {
      creditedAs: ["director"],
      excerpt: undefined,
      genres: ["Horror", "Action"],
      grade: "B+",
      gradeValue: 10,
      imdbId: "tt2",
      releaseSequence: 2,
      releaseYear: "1985",
      reviewDisplayDate: "Jan 1, 2021",
      reviewSequence: 2,
      reviewYear: "2021",
      slug: "test-2",
      sortTitle: "test 2",
      stillImageProps: {} as never,
      title: "Test 2",
      watchlistCollectionNames: [],
      watchlistDirectorNames: [],
      watchlistPerformerNames: [],
      watchlistWriterNames: [],
    },
    {
      creditedAs: ["writer"],
      excerpt: undefined,
      genres: ["Comedy", "Drama"],
      gradeValue: undefined,
      imdbId: "tt3",
      releaseSequence: 3,
      releaseYear: "1990",
      reviewSequence: undefined,
      reviewYear: undefined,
      slug: undefined,
      sortTitle: "test 3",
      stillImageProps: {} as never,
      title: "Test 3",
      watchlistCollectionNames: [],
      watchlistDirectorNames: [],
      watchlistPerformerNames: [],
      watchlistWriterNames: [],
    },
  ];

  it("counts all genres when no filters applied", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {};
    const counts = calculateGenreCounts(mockValues, filterValues);

    expect(counts.get("Horror")).toBe(2);
    expect(counts.get("Thriller")).toBe(1);
    expect(counts.get("Action")).toBe(1);
    expect(counts.get("Comedy")).toBe(1);
    expect(counts.get("Drama")).toBe(1);
  });

  it("counts genres while respecting grade filter", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      gradeValue: [10, 13], // B+ to A+
    };
    const counts = calculateGenreCounts(mockValues, filterValues);

    // Should only count titles with grades B+ or higher (tt1 and tt2)
    expect(counts.get("Horror")).toBe(2);
    expect(counts.get("Thriller")).toBe(1);
    expect(counts.get("Action")).toBe(1);
    expect(counts.get("Comedy")).toBeUndefined(); // tt3 has no grade
    expect(counts.get("Drama")).toBeUndefined(); // tt3 has no grade
  });

  it("counts genres while respecting release year filter", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      releaseYear: ["1980", "1985"],
    };
    const counts = calculateGenreCounts(mockValues, filterValues);

    // Should only count titles from 1980-1985 (tt1 and tt2)
    expect(counts.get("Horror")).toBe(2);
    expect(counts.get("Thriller")).toBe(1);
    expect(counts.get("Action")).toBe(1);
    expect(counts.get("Comedy")).toBeUndefined(); // tt3 is 1990
    expect(counts.get("Drama")).toBeUndefined(); // tt3 is 1990
  });

  it("counts genres while respecting review year filter", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      reviewYear: ["2020", "2021"],
    };
    const counts = calculateGenreCounts(mockValues, filterValues);

    // Should only count reviewed titles from 2020-2021 (tt1 and tt2)
    expect(counts.get("Horror")).toBe(2);
    expect(counts.get("Thriller")).toBe(1);
    expect(counts.get("Action")).toBe(1);
    expect(counts.get("Comedy")).toBeUndefined(); // tt3 not reviewed
    expect(counts.get("Drama")).toBeUndefined(); // tt3 not reviewed
  });

  it("counts genres while respecting reviewed status filter", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      reviewedStatus: "Reviewed",
    };
    const counts = calculateGenreCounts(mockValues, filterValues);

    // Should only count reviewed titles (tt1 and tt2)
    expect(counts.get("Horror")).toBe(2);
    expect(counts.get("Thriller")).toBe(1);
    expect(counts.get("Action")).toBe(1);
    expect(counts.get("Comedy")).toBeUndefined(); // tt3 not reviewed
    expect(counts.get("Drama")).toBeUndefined(); // tt3 not reviewed
  });

  it("counts genres while respecting credited as filter", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      creditedAs: ["director"],
    };
    const counts = calculateGenreCounts(mockValues, filterValues);

    // Should only count titles where person was credited as director (tt1 and tt2)
    expect(counts.get("Horror")).toBe(2);
    expect(counts.get("Thriller")).toBe(1);
    expect(counts.get("Action")).toBe(1);
    expect(counts.get("Comedy")).toBeUndefined(); // tt3 credited as writer
    expect(counts.get("Drama")).toBeUndefined(); // tt3 credited as writer
  });

  it("ignores genre filter when calculating counts", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      genres: ["Horror"], // This should be ignored
    };
    const counts = calculateGenreCounts(mockValues, filterValues);

    // Should count all genres, ignoring the genre filter itself
    expect(counts.get("Horror")).toBe(2);
    expect(counts.get("Thriller")).toBe(1);
    expect(counts.get("Action")).toBe(1);
    expect(counts.get("Comedy")).toBe(1);
    expect(counts.get("Drama")).toBe(1);
  });

  it("counts genres while respecting multiple filters", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      creditedAs: ["director"],
      gradeValue: [10, 13], // B+ to A+
      releaseYear: ["1980", "1985"],
    };
    const counts = calculateGenreCounts(mockValues, filterValues);

    // Should only count titles matching all filters (tt1 and tt2)
    expect(counts.get("Horror")).toBe(2);
    expect(counts.get("Thriller")).toBe(1);
    expect(counts.get("Action")).toBe(1);
    expect(counts.get("Comedy")).toBeUndefined();
    expect(counts.get("Drama")).toBeUndefined();
  });

  it("returns empty map when no values provided", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {};
    const counts = calculateGenreCounts([], filterValues);

    expect(counts.size).toBe(0);
  });

  it("returns empty map when filters exclude all values", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      releaseYear: ["2000", "2010"], // No titles in this range
    };
    const counts = calculateGenreCounts(mockValues, filterValues);

    expect(counts.size).toBe(0);
  });
});

describe("calculateReviewedStatusCounts", () => {
  const mockValues: CastAndCrewMemberTitlesValue[] = [
    {
      creditedAs: ["director"],
      excerpt: undefined,
      genres: ["Horror", "Thriller"],
      grade: "A",
      gradeValue: 12,
      imdbId: "tt1",
      releaseSequence: 1,
      releaseYear: "1980",
      reviewDisplayDate: "Jan 1, 2020",
      reviewSequence: 1,
      reviewYear: "2020",
      slug: "test-1", // reviewed
      sortTitle: "test 1",
      stillImageProps: {} as never,
      title: "Test 1",
      watchlistCollectionNames: [],
      watchlistDirectorNames: [],
      watchlistPerformerNames: [],
      watchlistWriterNames: [],
    },
    {
      creditedAs: ["director"],
      excerpt: undefined,
      genres: ["Horror", "Action"],
      grade: "B+",
      gradeValue: 10,
      imdbId: "tt2",
      releaseSequence: 2,
      releaseYear: "1985",
      reviewDisplayDate: "Jan 1, 2021",
      reviewSequence: 2,
      reviewYear: "2021",
      slug: "test-2", // reviewed
      sortTitle: "test 2",
      stillImageProps: {} as never,
      title: "Test 2",
      watchlistCollectionNames: [],
      watchlistDirectorNames: [],
      watchlistPerformerNames: [],
      watchlistWriterNames: [],
    },
    {
      creditedAs: ["writer"],
      excerpt: undefined,
      genres: ["Comedy", "Drama"],
      gradeValue: undefined,
      imdbId: "tt3",
      releaseSequence: 3,
      releaseYear: "1990",
      reviewSequence: undefined,
      reviewYear: undefined,
      slug: undefined, // not reviewed
      sortTitle: "test 3",
      stillImageProps: {} as never,
      title: "Test 3",
      watchlistCollectionNames: [],
      watchlistDirectorNames: [],
      watchlistPerformerNames: [],
      watchlistWriterNames: [],
    },
  ];

  it("counts all statuses when no filters applied", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {};
    const counts = calculateReviewedStatusCounts(mockValues, filterValues);

    expect(counts.get("All")).toBe(3);
    expect(counts.get("Reviewed")).toBe(2);
    expect(counts.get("Not Reviewed")).toBe(1);
  });

  it("counts statuses while respecting genre filter", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      genres: ["Horror"],
    };
    const counts = calculateReviewedStatusCounts(mockValues, filterValues);

    // Only 2 Horror titles (both reviewed)
    expect(counts.get("All")).toBe(2);
    expect(counts.get("Reviewed")).toBe(2);
    expect(counts.get("Not Reviewed")).toBe(0);
  });

  it("counts statuses while respecting grade filter", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      gradeValue: [10, 13], // B+ to A+
    };
    const counts = calculateReviewedStatusCounts(mockValues, filterValues);

    // Only 2 titles with grades (both reviewed)
    expect(counts.get("All")).toBe(2);
    expect(counts.get("Reviewed")).toBe(2);
    expect(counts.get("Not Reviewed")).toBe(0);
  });

  it("counts statuses while respecting credited as filter", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      creditedAs: ["director"],
    };
    const counts = calculateReviewedStatusCounts(mockValues, filterValues);

    // Only 2 director credits (both reviewed)
    expect(counts.get("All")).toBe(2);
    expect(counts.get("Reviewed")).toBe(2);
    expect(counts.get("Not Reviewed")).toBe(0);
  });

  it("ignores reviewed status filter when calculating counts", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {
      reviewedStatus: "Reviewed", // This should be ignored
    };
    const counts = calculateReviewedStatusCounts(mockValues, filterValues);

    // Should count all titles, ignoring the reviewed status filter
    expect(counts.get("All")).toBe(3);
    expect(counts.get("Reviewed")).toBe(2);
    expect(counts.get("Not Reviewed")).toBe(1);
  });

  it("returns zero counts when no values provided", () => {
    const filterValues: CastAndCrewMemberTitlesFiltersValues = {};
    const counts = calculateReviewedStatusCounts([], filterValues);

    expect(counts.get("All")).toBe(0);
    expect(counts.get("Reviewed")).toBe(0);
    expect(counts.get("Not Reviewed")).toBe(0);
  });
});
