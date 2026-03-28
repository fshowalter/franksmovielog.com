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
          displayText: "Horror",
          key: "genre-horror",
          value: "Horror",
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
          displayText: "Horror",
          key: "genre-horror",
          value: "Horror",
        },
        {
          displayText: "Action",
          key: "genre-action",
          value: "Action",
        },
        {
          displayText: "Comedy",
          key: "genre-comedy",
          value: "Comedy",
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
          displayText: "Science Fiction",
          key: "genre-science-fiction",
          value: "Science Fiction",
        },
      ]);
    });

    it("handles genres with hyphens (Sci-Fi)", () => {
      const filterValues: ReviewsFiltersValues = {
        genres: ["Sci-Fi"],
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([
        {
          displayText: "Sci-Fi",
          key: "genre-sci-fi",
          value: "Sci-Fi",
        },
      ]);
    });

    it("handles genres with hyphens (Film-Noir)", () => {
      const filterValues: ReviewsFiltersValues = {
        genres: ["Film-Noir"],
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([
        {
          displayText: "Film-Noir",
          key: "genre-film-noir",
          value: "Film-Noir",
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
        gradeValue: [14, 14], // A-
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([
        {
          displayText: "Grade: A-",
          key: "gradeValue",
        },
      ]);
    });

    it("creates a chip for a grade range", () => {
      const filterValues: ReviewsFiltersValues = {
        gradeValue: [13, 14], // B+ to A-
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([
        {
          displayText: "Grade: B+ to A-",
          key: "gradeValue",
        },
      ]);
    });

    it("creates a chip for a wide grade range (F to A)", () => {
      const filterValues: ReviewsFiltersValues = {
        gradeValue: [3, 15], // F to A (wide non-default range)
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([
        {
          displayText: "Grade: F to A",
          key: "gradeValue",
        },
      ]);
    });

    it("does not create chip for default full range (F- to A+)", () => {
      const filterValues: ReviewsFiltersValues = {
        gradeValue: [2, 16], // F- to A+ (default)
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([]);
    });

    it("handles all grade values correctly", () => {
      const grades = [
        [16, "A+"],
        [15, "A"],
        [14, "A-"],
        [13, "B+"],
        [12, "B"],
        [11, "B-"],
        [10, "C+"],
        [9, "C"],
        [8, "C-"],
        [7, "D+"],
        [6, "D"],
        [5, "D-"],
        [4, "F+"],
        [3, "F"],
        [2, "F-"],
      ] as const;

      for (const [gradeNumber, gradeLetter] of grades) {
        const filterValues: ReviewsFiltersValues = {
          gradeValue: [gradeNumber, gradeNumber],
        };

        const result = buildAppliedFilterChips(filterValues);

        expect(result).toEqual([
          {
            displayText: `Grade: ${gradeLetter}`,
            key: "gradeValue",
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
          displayText: "Release Year: 1980",
          key: "releaseYear",
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
          displayText: "Release Year: 1980 to 1989",
          key: "releaseYear",
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
          displayText: "Review Year: 2020",
          key: "reviewYear",
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
          displayText: "Review Year: 2020 to 2024",
          key: "reviewYear",
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
          displayText: "Search: alien",
          key: "title",
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
          displayText: "Search: The Matrix",
          key: "title",
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
        gradeValue: [13, 14], // B+ to A-
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
          displayText: "Horror",
          key: "genre-horror",
          value: "Horror",
        },
        {
          displayText: "Action",
          key: "genre-action",
          value: "Action",
        },
        {
          displayText: "Grade: B+ to A-",
          key: "gradeValue",
        },
        {
          displayText: "Release Year: 1980 to 1989",
          key: "releaseYear",
        },
        {
          displayText: "Review Year: 2020 to 2024",
          key: "reviewYear",
        },
        {
          displayText: "Search: alien",
          key: "title",
        },
      ]);
    });

    it("excludes default grade range from combined filters", () => {
      const filterValues: ReviewsFiltersValues = {
        genres: ["Horror"],
        gradeValue: [2, 16], // Default full range
        releaseYear: ["1980", "1989"],
      };

      const result = buildAppliedFilterChips(filterValues, {
        distinctReleaseYears: ["1920", "2024"],
      });

      expect(result).toEqual([
        {
          displayText: "Horror",
          key: "genre-horror",
          value: "Horror",
        },
        {
          displayText: "Release Year: 1980 to 1989",
          key: "releaseYear",
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
          displayText: "Horror",
          key: "genre-horror",
          value: "Horror",
        },
        {
          displayText: "Release Year: 1980 to 1989",
          key: "releaseYear",
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
          displayText: "Horror",
          key: "genre-horror",
          value: "Horror",
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

      expect(result.map((chip) => chip.key)).toEqual([
        "genre-drama",
        "gradeValue",
        "releaseYear",
        "reviewYear",
        "title",
      ]);
    });

    it("maintains genre order from input array", () => {
      const filterValues: ReviewsFiltersValues = {
        genres: ["Zebra", "Apple", "Monster"],
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result.map((chip) => chip.displayText)).toEqual([
        "Zebra",
        "Apple",
        "Monster",
      ]);
    });
  });
});
