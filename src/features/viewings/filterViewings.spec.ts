import { beforeEach, describe, expect, it } from "vitest";

import type { PosterImageProps } from "~/api/posters";

import type { ViewingsValue } from "./Viewings";
import type { ViewingsFiltersValues } from "./Viewings.reducer";

import {
  calculateMediumCounts,
  calculateReviewedStatusCounts,
  calculateVenueCounts,
} from "./filterViewings";

const mockPosterImageProps: PosterImageProps = {
  src: "/test.png",
  srcSet: "/test.png 1x",
};

describe("calculateMediumCounts", () => {
  let values: ViewingsValue[];

  beforeEach(() => {
    values = [
      {
        medium: "Blu-ray",
        posterImageProps: mockPosterImageProps,
        releaseYear: "2020",
        slug: "movie-1",
        sortTitle: "movie 1",
        title: "Movie 1",
        venue: "Home",
        viewingDate: "2023-01-15",
        viewingSequence: 1,
        viewingYear: "2023",
      },
      {
        medium: "4K UHD",
        posterImageProps: mockPosterImageProps,
        releaseYear: "2021",
        slug: "movie-2",
        sortTitle: "movie 2",
        title: "Movie 2",
        venue: "Home",
        viewingDate: "2023-02-20",
        viewingSequence: 2,
        viewingYear: "2023",
      },
      {
        medium: "Blu-ray",
        posterImageProps: mockPosterImageProps,
        releaseYear: "2022",
        sortTitle: "movie 3",
        title: "Movie 3",
        venue: "Theater",
        viewingDate: "2024-03-10",
        viewingSequence: 3,
        viewingYear: "2024",
      },
      {
        medium: "Streaming",
        posterImageProps: mockPosterImageProps,
        releaseYear: "2023",
        slug: "movie-4",
        sortTitle: "movie 4",
        title: "Movie 4",
        venue: "Home",
        viewingDate: "2024-04-05",
        viewingSequence: 4,
        viewingYear: "2024",
      },
    ];
  });

  it("returns counts for all media types when no filters applied", () => {
    const filterValues: ViewingsFiltersValues = {};
    const counts = calculateMediumCounts(values, filterValues);

    expect(counts.get("Blu-ray")).toBe(2);
    expect(counts.get("4K UHD")).toBe(1);
    expect(counts.get("Streaming")).toBe(1);
  });

  it("respects venue filter when calculating medium counts", () => {
    const filterValues: ViewingsFiltersValues = {
      venue: "Home",
    };
    const counts = calculateMediumCounts(values, filterValues);

    expect(counts.get("Blu-ray")).toBe(1);
    expect(counts.get("4K UHD")).toBe(1);
    expect(counts.get("Streaming")).toBe(1);
    expect(counts.get("Theater")).toBe(undefined);
  });

  it("respects viewing year filter when calculating medium counts", () => {
    const filterValues: ViewingsFiltersValues = {
      viewingYear: ["2024", "2024"],
    };
    const counts = calculateMediumCounts(values, filterValues);

    expect(counts.get("Blu-ray")).toBe(1);
    expect(counts.get("Streaming")).toBe(1);
    expect(counts.get("4K UHD")).toBe(undefined);
  });

  it("respects reviewed status filter when calculating medium counts", () => {
    const filterValues: ViewingsFiltersValues = {
      reviewedStatus: "Reviewed",
    };
    const counts = calculateMediumCounts(values, filterValues);

    expect(counts.get("Blu-ray")).toBe(1);
    expect(counts.get("4K UHD")).toBe(1);
    expect(counts.get("Streaming")).toBe(1);
  });

  it("returns empty map when no viewings match filters", () => {
    const filterValues: ViewingsFiltersValues = {
      venue: "Nonexistent",
    };
    const counts = calculateMediumCounts(values, filterValues);

    expect(counts.size).toBe(0);
  });
});

describe("calculateVenueCounts", () => {
  let values: ViewingsValue[];

  beforeEach(() => {
    values = [
      {
        medium: "Blu-ray",
        posterImageProps: mockPosterImageProps,
        releaseYear: "2020",
        slug: "movie-1",
        sortTitle: "movie 1",
        title: "Movie 1",
        venue: "Home",
        viewingDate: "2023-01-15",
        viewingSequence: 1,
        viewingYear: "2023",
      },
      {
        medium: "4K UHD",
        posterImageProps: mockPosterImageProps,
        releaseYear: "2021",
        slug: "movie-2",
        sortTitle: "movie 2",
        title: "Movie 2",
        venue: "Theater",
        viewingDate: "2023-02-20",
        viewingSequence: 2,
        viewingYear: "2023",
      },
      {
        medium: "Blu-ray",
        posterImageProps: mockPosterImageProps,
        releaseYear: "2022",
        sortTitle: "movie 3",
        title: "Movie 3",
        venue: "Home",
        viewingDate: "2024-03-10",
        viewingSequence: 3,
        viewingYear: "2024",
      },
      {
        medium: "Streaming",
        posterImageProps: mockPosterImageProps,
        releaseYear: "2023",
        slug: "movie-4",
        sortTitle: "movie 4",
        title: "Movie 4",
        venue: "Home",
        viewingDate: "2024-04-05",
        viewingSequence: 4,
        viewingYear: "2024",
      },
    ];
  });

  it("returns counts for all venues when no filters applied", () => {
    const filterValues: ViewingsFiltersValues = {};
    const counts = calculateVenueCounts(values, filterValues);

    expect(counts.get("Home")).toBe(3);
    expect(counts.get("Theater")).toBe(1);
  });

  it("respects medium filter when calculating venue counts", () => {
    const filterValues: ViewingsFiltersValues = {
      medium: "Blu-ray",
    };
    const counts = calculateVenueCounts(values, filterValues);

    expect(counts.get("Home")).toBe(2);
    expect(counts.get("Theater")).toBe(undefined);
  });

  it("respects viewing year filter when calculating venue counts", () => {
    const filterValues: ViewingsFiltersValues = {
      viewingYear: ["2024", "2024"],
    };
    const counts = calculateVenueCounts(values, filterValues);

    expect(counts.get("Home")).toBe(2);
    expect(counts.get("Theater")).toBe(undefined);
  });

  it("respects reviewed status filter when calculating venue counts", () => {
    const filterValues: ViewingsFiltersValues = {
      reviewedStatus: ["Not Reviewed"],
    };
    const counts = calculateVenueCounts(values, filterValues);

    expect(counts.get("Home")).toBe(1);
    expect(counts.get("Theater")).toBe(undefined);
  });

  it("returns empty map when no viewings match filters", () => {
    const filterValues: ViewingsFiltersValues = {
      medium: ["Nonexistent"],
    };
    const counts = calculateVenueCounts(values, filterValues);

    expect(counts.size).toBe(0);
  });
});

describe("calculateReviewedStatusCounts", () => {
  let values: ViewingsValue[];

  beforeEach(() => {
    values = [
      {
        medium: "Blu-ray",
        posterImageProps: mockPosterImageProps,
        releaseYear: "2020",
        slug: "movie-1",
        sortTitle: "movie 1",
        title: "Movie 1",
        venue: "Home",
        viewingDate: "2023-01-15",
        viewingSequence: 1,
        viewingYear: "2023",
      },
      {
        medium: "4K UHD",
        posterImageProps: mockPosterImageProps,
        releaseYear: "2021",
        slug: "movie-2",
        sortTitle: "movie 2",
        title: "Movie 2",
        venue: "Theater",
        viewingDate: "2023-02-20",
        viewingSequence: 2,
        viewingYear: "2023",
      },
      {
        medium: "Blu-ray",
        posterImageProps: mockPosterImageProps,
        releaseYear: "2022",
        sortTitle: "movie 3",
        title: "Movie 3",
        venue: "Home",
        viewingDate: "2024-03-10",
        viewingSequence: 3,
        viewingYear: "2024",
      },
      {
        medium: "Streaming",
        posterImageProps: mockPosterImageProps,
        releaseYear: "2023",
        slug: "movie-4",
        sortTitle: "movie 4",
        title: "Movie 4",
        venue: "Home",
        viewingDate: "2024-04-05",
        viewingSequence: 4,
        viewingYear: "2024",
      },
    ];
  });

  it("returns correct counts for all status types when no filters applied", () => {
    const filterValues: ViewingsFiltersValues = {};
    const counts = calculateReviewedStatusCounts(values, filterValues);

    expect(counts.get("All")).toBe(4);
    expect(counts.get("Reviewed")).toBe(3);
    expect(counts.get("Not Reviewed")).toBe(1);
  });

  it("respects medium filter when calculating reviewed status counts", () => {
    const filterValues: ViewingsFiltersValues = {
      medium: "Blu-ray",
    };
    const counts = calculateReviewedStatusCounts(values, filterValues);

    expect(counts.get("All")).toBe(2);
    expect(counts.get("Reviewed")).toBe(1);
    expect(counts.get("Not Reviewed")).toBe(1);
  });

  it("respects venue filter when calculating reviewed status counts", () => {
    const filterValues: ViewingsFiltersValues = {
      venue: "Theater",
    };
    const counts = calculateReviewedStatusCounts(values, filterValues);

    expect(counts.get("All")).toBe(1);
    expect(counts.get("Reviewed")).toBe(1);
    expect(counts.get("Not Reviewed")).toBe(0);
  });

  it("respects viewing year filter when calculating reviewed status counts", () => {
    const filterValues: ViewingsFiltersValues = {
      viewingYear: ["2024", "2024"],
    };
    const counts = calculateReviewedStatusCounts(values, filterValues);

    expect(counts.get("All")).toBe(2);
    expect(counts.get("Reviewed")).toBe(1);
    expect(counts.get("Not Reviewed")).toBe(1);
  });

  it("returns zero counts when no viewings match filters", () => {
    const filterValues: ViewingsFiltersValues = {
      medium: "Nonexistent",
    };
    const counts = calculateReviewedStatusCounts(values, filterValues);

    expect(counts.get("All")).toBe(0);
    expect(counts.get("Reviewed")).toBe(0);
    expect(counts.get("Not Reviewed")).toBe(0);
  });
});
