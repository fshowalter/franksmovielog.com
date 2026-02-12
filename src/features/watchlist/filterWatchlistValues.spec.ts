import { beforeEach, describe, expect, it } from "vitest";

import type { WatchlistValue } from "./Watchlist";
import type { WatchlistFiltersValues } from "./Watchlist.reducer";

import {
  calculateCollectionCounts,
  calculateDirectorCounts,
  calculateGenreCounts,
  calculatePerformerCounts,
  calculateWriterCounts,
} from "./filterWatchlistValues";

describe("filterWatchlistValues", () => {
  let mockValues: WatchlistValue[];

  beforeEach(() => {
    mockValues = [
      {
        genres: ["Horror", "Thriller"],
        imdbId: "tt0000001",
        releaseSequence: 1,
        releaseYear: "2020",
        sortTitle: "Test Title 1",
        title: "Test Title 1",
        watchlistCollectionNames: ["Collection A"],
        watchlistDirectorNames: ["Director A"],
        watchlistPerformerNames: ["Actor A", "Actor B"],
        watchlistWriterNames: ["Writer A"],
      },
      {
        genres: ["Action", "Horror"],
        imdbId: "tt0000002",
        releaseSequence: 2,
        releaseYear: "2021",
        sortTitle: "Test Title 2",
        title: "Test Title 2",
        watchlistCollectionNames: ["Collection B"],
        watchlistDirectorNames: ["Director B"],
        watchlistPerformerNames: ["Actor B", "Actor C"],
        watchlistWriterNames: ["Writer B"],
      },
      {
        genres: ["Comedy"],
        imdbId: "tt0000003",
        releaseSequence: 3,
        releaseYear: "2019",
        sortTitle: "Test Title 3",
        title: "Test Title 3",
        watchlistCollectionNames: ["Collection A", "Collection C"],
        watchlistDirectorNames: ["Director A"],
        watchlistPerformerNames: ["Actor D"],
        watchlistWriterNames: ["Writer A", "Writer C"],
      },
    ];
  });

  describe("calculateGenreCounts", () => {
    it("counts all genres when no filters applied", () => {
      const filters: WatchlistFiltersValues = { genres: [] };
      const counts = calculateGenreCounts(mockValues, filters);

      expect(counts.get("Horror")).toBe(2);
      expect(counts.get("Thriller")).toBe(1);
      expect(counts.get("Action")).toBe(1);
      expect(counts.get("Comedy")).toBe(1);
    });

    it("respects director filter when counting genres", () => {
      const filters: WatchlistFiltersValues = {
        director: ["Director A"],
        genres: [],
      };
      const counts = calculateGenreCounts(mockValues, filters);

      // Director A has Horror, Thriller, Comedy
      expect(counts.get("Horror")).toBe(1);
      expect(counts.get("Thriller")).toBe(1);
      expect(counts.get("Comedy")).toBe(1);
      expect(counts.get("Action")).toBeUndefined();
    });

    it("respects release year filter when counting genres", () => {
      const filters: WatchlistFiltersValues = {
        genres: [],
        releaseYear: ["2020", "2021"],
      };
      const counts = calculateGenreCounts(mockValues, filters);

      // 2020-2021 has Horror, Thriller, Action
      expect(counts.get("Horror")).toBe(2);
      expect(counts.get("Thriller")).toBe(1);
      expect(counts.get("Action")).toBe(1);
      expect(counts.get("Comedy")).toBeUndefined();
    });

    it("returns empty map when no values match filters", () => {
      const filters: WatchlistFiltersValues = {
        director: ["Nonexistent Director"],
        genres: [],
      };
      const counts = calculateGenreCounts(mockValues, filters);

      expect(counts.size).toBe(0);
    });

    it("returns empty map when values array is empty", () => {
      const filters: WatchlistFiltersValues = { genres: [] };
      const counts = calculateGenreCounts([], filters);

      expect(counts.size).toBe(0);
    });
  });

  describe("calculateDirectorCounts", () => {
    it("counts all directors when no filters applied", () => {
      const filters: WatchlistFiltersValues = { genres: [] };
      const counts = calculateDirectorCounts(mockValues, filters);

      expect(counts.get("Director A")).toBe(2);
      expect(counts.get("Director B")).toBe(1);
    });

    it("respects genre filter when counting directors", () => {
      const filters: WatchlistFiltersValues = { genres: ["Horror"] };
      const counts = calculateDirectorCounts(mockValues, filters);

      // Horror titles have Director A and Director B
      expect(counts.get("Director A")).toBe(1);
      expect(counts.get("Director B")).toBe(1);
    });

    it("respects collection filter when counting directors", () => {
      const filters: WatchlistFiltersValues = {
        collection: ["Collection A"],
        genres: [],
      };
      const counts = calculateDirectorCounts(mockValues, filters);

      // Collection A has Director A (appears in 2 titles)
      expect(counts.get("Director A")).toBe(2);
      expect(counts.get("Director B")).toBeUndefined();
    });

    it("returns empty map when no values match filters", () => {
      const filters: WatchlistFiltersValues = { genres: ["Nonexistent"] };
      const counts = calculateDirectorCounts(mockValues, filters);

      expect(counts.size).toBe(0);
    });
  });

  describe("calculatePerformerCounts", () => {
    it("counts all performers when no filters applied", () => {
      const filters: WatchlistFiltersValues = { genres: [] };
      const counts = calculatePerformerCounts(mockValues, filters);

      expect(counts.get("Actor A")).toBe(1);
      expect(counts.get("Actor B")).toBe(2);
      expect(counts.get("Actor C")).toBe(1);
      expect(counts.get("Actor D")).toBe(1);
    });

    it("respects director filter when counting performers", () => {
      const filters: WatchlistFiltersValues = {
        director: ["Director A"],
        genres: [],
      };
      const counts = calculatePerformerCounts(mockValues, filters);

      // Director A titles have Actor A, Actor B, Actor D
      expect(counts.get("Actor A")).toBe(1);
      expect(counts.get("Actor B")).toBe(1);
      expect(counts.get("Actor D")).toBe(1);
      expect(counts.get("Actor C")).toBeUndefined();
    });

    it("respects genre filter when counting performers", () => {
      const filters: WatchlistFiltersValues = { genres: ["Horror"] };
      const counts = calculatePerformerCounts(mockValues, filters);

      // Horror titles have Actor A, Actor B, Actor C
      expect(counts.get("Actor A")).toBe(1);
      expect(counts.get("Actor B")).toBe(2);
      expect(counts.get("Actor C")).toBe(1);
      expect(counts.get("Actor D")).toBeUndefined();
    });
  });

  describe("calculateWriterCounts", () => {
    it("counts all writers when no filters applied", () => {
      const filters: WatchlistFiltersValues = { genres: [] };
      const counts = calculateWriterCounts(mockValues, filters);

      expect(counts.get("Writer A")).toBe(2);
      expect(counts.get("Writer B")).toBe(1);
      expect(counts.get("Writer C")).toBe(1);
    });

    it("respects genre filter when counting writers", () => {
      const filters: WatchlistFiltersValues = { genres: ["Horror"] };
      const counts = calculateWriterCounts(mockValues, filters);

      // Horror titles have Writer A and Writer B
      expect(counts.get("Writer A")).toBe(1);
      expect(counts.get("Writer B")).toBe(1);
      expect(counts.get("Writer C")).toBeUndefined();
    });

    it("respects performer filter when counting writers", () => {
      const filters: WatchlistFiltersValues = {
        genres: [],
        performer: ["Actor B"],
      };
      const counts = calculateWriterCounts(mockValues, filters);

      // Actor B titles have Writer A and Writer B
      expect(counts.get("Writer A")).toBe(1);
      expect(counts.get("Writer B")).toBe(1);
      expect(counts.get("Writer C")).toBeUndefined();
    });
  });

  describe("calculateCollectionCounts", () => {
    it("counts all collections when no filters applied", () => {
      const filters: WatchlistFiltersValues = { genres: [] };
      const counts = calculateCollectionCounts(mockValues, filters);

      expect(counts.get("Collection A")).toBe(2);
      expect(counts.get("Collection B")).toBe(1);
      expect(counts.get("Collection C")).toBe(1);
    });

    it("respects genre filter when counting collections", () => {
      const filters: WatchlistFiltersValues = { genres: ["Horror"] };
      const counts = calculateCollectionCounts(mockValues, filters);

      // Horror titles have Collection A and Collection B
      expect(counts.get("Collection A")).toBe(1);
      expect(counts.get("Collection B")).toBe(1);
      expect(counts.get("Collection C")).toBeUndefined();
    });

    it("respects director filter when counting collections", () => {
      const filters: WatchlistFiltersValues = {
        director: ["Director A"],
        genres: [],
      };
      const counts = calculateCollectionCounts(mockValues, filters);

      // Director A titles have Collection A and Collection C
      expect(counts.get("Collection A")).toBe(2);
      expect(counts.get("Collection C")).toBe(1);
      expect(counts.get("Collection B")).toBeUndefined();
    });

    it("respects multiple filters when counting collections", () => {
      const filters: WatchlistFiltersValues = {
        director: ["Director A"],
        genres: ["Horror"],
      };
      const counts = calculateCollectionCounts(mockValues, filters);

      // Director A + Horror = only first title with Collection A
      expect(counts.get("Collection A")).toBe(1);
      expect(counts.get("Collection B")).toBeUndefined();
      expect(counts.get("Collection C")).toBeUndefined();
    });
  });
});
