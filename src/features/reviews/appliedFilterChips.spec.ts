import { describe, expect, it } from "vitest";

import type { ReviewsFiltersValues } from "./reducer";

import { buildAppliedFilterChips } from "./appliedFilterChips";

describe("buildAppliedFilterChips", () => {
  describe("with no filters", () => {
    it("returns empty array when filterValues is empty", () => {
      const filterValues: ReviewsFiltersValues = {};

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([]);
    });
  });

  describe("genre filters", () => {
    it("creates a chip for a single genre", () => {
      const filterValues: ReviewsFiltersValues = {
        genres: ["Horror"],
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([
        {
          category: "Genre",
          id: "genre-horror",
          label: "Horror",
        },
      ]);
    });

    it("creates chips for multiple genres", () => {
      const filterValues: ReviewsFiltersValues = {
        genres: ["Horror", "Action", "Comedy"],
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([
        {
          category: "Genre",
          id: "genre-horror",
          label: "Horror",
        },
        {
          category: "Genre",
          id: "genre-action",
          label: "Action",
        },
        {
          category: "Genre",
          id: "genre-comedy",
          label: "Comedy",
        },
      ]);
    });

    it("handles genres with spaces in the name", () => {
      const filterValues: ReviewsFiltersValues = {
        genres: ["Science Fiction"],
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([
        {
          category: "Genre",
          id: "genre-science-fiction",
          label: "Science Fiction",
        },
      ]);
    });

    it("handles genres with mixed case", () => {
      const filterValues: ReviewsFiltersValues = {
        genres: ["Sci-Fi"],
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([
        {
          category: "Genre",
          id: "genre-sci-fi",
          label: "Sci-Fi",
        },
      ]);
    });

    it("returns empty array when genres is empty array", () => {
      const filterValues: ReviewsFiltersValues = {
        genres: [],
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([]);
    });
  });

  describe("grade filter", () => {
    it("creates a chip for a single grade (min === max)", () => {
      const filterValues: ReviewsFiltersValues = {
        gradeValue: [11, 11], // A-
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([
        {
          category: "Grade",
          id: "gradeValue",
          label: "A-",
        },
      ]);
    });

    it("creates a chip for a grade range", () => {
      const filterValues: ReviewsFiltersValues = {
        gradeValue: [11, 10], // A- to B+
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([
        {
          category: "Grade",
          id: "gradeValue",
          label: "B+ to A-",
        },
      ]);
    });

    it("handles full grade range (A+ to F)", () => {
      const filterValues: ReviewsFiltersValues = {
        gradeValue: [13, 1], // A+ to F
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([
        {
          category: "Grade",
          id: "gradeValue",
          label: "F to A+",
        },
      ]);
    });

    it("does not create chip for default full range (F to A+)", () => {
      const filterValues: ReviewsFiltersValues = {
        gradeValue: [1, 13], // F to A+ (default)
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([]);
    });

    it("handles all grade values correctly", () => {
      const grades = [
        [13, "A+"],
        [12, "A"],
        [11, "A-"],
        [10, "B+"],
        [9, "B"],
        [8, "B-"],
        [7, "C+"],
        [6, "C"],
        [5, "C-"],
        [4, "D+"],
        [3, "D"],
        [2, "D-"],
        [1, "F"],
      ] as const;

      for (const [gradeNumber, gradeLetter] of grades) {
        const filterValues: ReviewsFiltersValues = {
          gradeValue: [gradeNumber, gradeNumber],
        };

        const result = buildAppliedFilterChips(filterValues);

        expect(result).toEqual([
          {
            category: "Grade",
            id: "gradeValue",
            label: gradeLetter,
          },
        ]);
      }
    });
  });

  describe("release year filter", () => {
    it("creates a chip for a single year (min === max)", () => {
      const filterValues: ReviewsFiltersValues = {
        releaseYear: ["1980", "1980"],
      };

      const result = buildAppliedFilterChips(filterValues, {
        distinctReleaseYears: ["1920", "2024"],
      });

      expect(result).toEqual([
        {
          category: "Release Year",
          id: "releaseYear",
          label: "1980",
        },
      ]);
    });

    it("creates a chip for a year range", () => {
      const filterValues: ReviewsFiltersValues = {
        releaseYear: ["1980", "1989"],
      };

      const result = buildAppliedFilterChips(filterValues, {
        distinctReleaseYears: ["1920", "2024"],
      });

      expect(result).toEqual([
        {
          category: "Release Year",
          id: "releaseYear",
          label: "1980-1989",
        },
      ]);
    });

    it("does not create chip for full default range", () => {
      const filterValues: ReviewsFiltersValues = {
        releaseYear: ["1920", "2024"],
      };

      const result = buildAppliedFilterChips(filterValues, {
        distinctReleaseYears: ["1920", "2024"],
      });

      expect(result).toEqual([]);
    });

    it("does not create chip when context is missing", () => {
      const filterValues: ReviewsFiltersValues = {
        releaseYear: ["1980", "1989"],
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([]);
    });
  });

  describe("review year filter", () => {
    it("creates a chip for a single year (min === max)", () => {
      const filterValues: ReviewsFiltersValues = {
        reviewYear: ["2020", "2020"],
      };

      const result = buildAppliedFilterChips(filterValues, {
        distinctReviewYears: ["2018", "2024"],
      });

      expect(result).toEqual([
        {
          category: "Review Year",
          id: "reviewYear",
          label: "2020",
        },
      ]);
    });

    it("creates a chip for a year range", () => {
      const filterValues: ReviewsFiltersValues = {
        reviewYear: ["2020", "2024"],
      };

      const result = buildAppliedFilterChips(filterValues, {
        distinctReviewYears: ["2018", "2024"],
      });

      expect(result).toEqual([
        {
          category: "Review Year",
          id: "reviewYear",
          label: "2020-2024",
        },
      ]);
    });

    it("does not create chip for full default range", () => {
      const filterValues: ReviewsFiltersValues = {
        reviewYear: ["2018", "2024"],
      };

      const result = buildAppliedFilterChips(filterValues, {
        distinctReviewYears: ["2018", "2024"],
      });

      expect(result).toEqual([]);
    });

    it("does not create chip when context is missing", () => {
      const filterValues: ReviewsFiltersValues = {
        reviewYear: ["2020", "2024"],
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([]);
    });
  });

  describe("title search filter", () => {
    it("creates a chip for a search query", () => {
      const filterValues: ReviewsFiltersValues = {
        title: "alien",
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([
        {
          category: "Search",
          id: "title",
          label: "alien",
        },
      ]);
    });

    it("preserves search query case", () => {
      const filterValues: ReviewsFiltersValues = {
        title: "The Matrix",
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([
        {
          category: "Search",
          id: "title",
          label: "The Matrix",
        },
      ]);
    });

    it("does not create chip for empty string", () => {
      const filterValues: ReviewsFiltersValues = {
        title: "",
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([]);
    });

    it("does not create chip for whitespace-only string", () => {
      const filterValues: ReviewsFiltersValues = {
        title: "   ",
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([]);
    });
  });

  describe("multiple filters combined", () => {
    it("creates chips for all active filters", () => {
      const filterValues: ReviewsFiltersValues = {
        genres: ["Horror", "Action"],
        gradeValue: [11, 10], // A- to B+
        releaseYear: ["1980", "1989"],
        reviewYear: ["2020", "2024"],
        title: "alien",
      };

      const result = buildAppliedFilterChips(filterValues, {
        distinctReleaseYears: ["1920", "2024"],
        distinctReviewYears: ["2018", "2024"],
      });

      expect(result).toEqual([
        {
          category: "Genre",
          id: "genre-horror",
          label: "Horror",
        },
        {
          category: "Genre",
          id: "genre-action",
          label: "Action",
        },
        {
          category: "Grade",
          id: "gradeValue",
          label: "B+ to A-",
        },
        {
          category: "Release Year",
          id: "releaseYear",
          label: "1980-1989",
        },
        {
          category: "Review Year",
          id: "reviewYear",
          label: "2020-2024",
        },
        {
          category: "Search",
          id: "title",
          label: "alien",
        },
      ]);
    });

    it("excludes default grade range from combined filters", () => {
      const filterValues: ReviewsFiltersValues = {
        genres: ["Horror"],
        gradeValue: [1, 13], // Default full range
        releaseYear: ["1980", "1989"],
      };

      const result = buildAppliedFilterChips(filterValues, {
        distinctReleaseYears: ["1920", "2024"],
      });

      expect(result).toEqual([
        {
          category: "Genre",
          id: "genre-horror",
          label: "Horror",
        },
        {
          category: "Release Year",
          id: "releaseYear",
          label: "1980-1989",
        },
      ]);
    });

    it("excludes empty title from combined filters", () => {
      const filterValues: ReviewsFiltersValues = {
        genres: ["Horror"],
        releaseYear: ["1980", "1989"],
        title: "",
      };

      const result = buildAppliedFilterChips(filterValues, {
        distinctReleaseYears: ["1920", "2024"],
      });

      expect(result).toEqual([
        {
          category: "Genre",
          id: "genre-horror",
          label: "Horror",
        },
        {
          category: "Release Year",
          id: "releaseYear",
          label: "1980-1989",
        },
      ]);
    });

    it("excludes default year ranges from combined filters", () => {
      const filterValues: ReviewsFiltersValues = {
        genres: ["Horror"],
        releaseYear: ["1920", "2024"], // Full range
        reviewYear: ["2018", "2024"], // Full range
      };

      const result = buildAppliedFilterChips(filterValues, {
        distinctReleaseYears: ["1920", "2024"],
        distinctReviewYears: ["2018", "2024"],
      });

      expect(result).toEqual([
        {
          category: "Genre",
          id: "genre-horror",
          label: "Horror",
        },
      ]);
    });
  });

  describe("chip ordering", () => {
    it("maintains consistent order: genres, grade, releaseYear, reviewYear, title", () => {
      const filterValues: ReviewsFiltersValues = {
        genres: ["Drama"],
        gradeValue: [10, 10],
        releaseYear: ["2000", "2010"],
        reviewYear: ["2015", "2020"],
        title: "test",
      };

      const result = buildAppliedFilterChips(filterValues, {
        distinctReleaseYears: ["1920", "2024"],
        distinctReviewYears: ["2010", "2024"],
      });

      expect(result.map((chip) => chip.category)).toEqual([
        "Genre",
        "Grade",
        "Release Year",
        "Review Year",
        "Search",
      ]);
    });

    it("maintains genre order from input array", () => {
      const filterValues: ReviewsFiltersValues = {
        genres: ["Zebra", "Apple", "Monster"],
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result.map((chip) => chip.label)).toEqual([
        "Zebra",
        "Apple",
        "Monster",
      ]);
    });
  });
});
