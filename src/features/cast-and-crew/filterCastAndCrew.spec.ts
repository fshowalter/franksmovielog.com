import { beforeEach, describe, expect, it } from "vitest";

import type { CastAndCrewValue } from "./CastAndCrew";
import type { CastAndCrewFiltersValues } from "./CastAndCrew.reducer";

import {
  calculateCreditedAsCounts,
  filterCastAndCrew,
} from "./filterCastAndCrew";

describe("filterCastAndCrew", () => {
  let mockValues: CastAndCrewValue[];

  beforeEach(() => {
    mockValues = [
      {
        avatarImageProps: undefined,
        creditedAs: ["director", "writer"],
        name: "Christopher Nolan",
        reviewCount: 10,
        slug: "christopher-nolan",
      },
      {
        avatarImageProps: undefined,
        creditedAs: ["performer"],
        name: "Tom Hardy",
        reviewCount: 8,
        slug: "tom-hardy",
      },
      {
        avatarImageProps: undefined,
        creditedAs: ["director"],
        name: "Denis Villeneuve",
        reviewCount: 6,
        slug: "denis-villeneuve",
      },
      {
        avatarImageProps: undefined,
        creditedAs: ["writer"],
        name: "Aaron Sorkin",
        reviewCount: 4,
        slug: "aaron-sorkin",
      },
      {
        avatarImageProps: undefined,
        creditedAs: ["performer", "director"],
        name: "Clint Eastwood",
        reviewCount: 12,
        slug: "clint-eastwood",
      },
    ];
  });

  describe("basic filtering", () => {
    it("returns all values when no filters applied", () => {
      const filterValues: CastAndCrewFiltersValues = {};
      const result = filterCastAndCrew(mockValues, filterValues);

      expect(result).toHaveLength(5);
    });

    it("filters by creditedAs = director", () => {
      const filterValues: CastAndCrewFiltersValues = {
        creditedAs: "director",
      };
      const result = filterCastAndCrew(mockValues, filterValues);

      expect(result).toHaveLength(3);
      expect(result.map((v) => v.name)).toEqual([
        "Christopher Nolan",
        "Denis Villeneuve",
        "Clint Eastwood",
      ]);
    });

    it("filters by creditedAs = performer", () => {
      const filterValues: CastAndCrewFiltersValues = {
        creditedAs: "performer",
      };
      const result = filterCastAndCrew(mockValues, filterValues);

      expect(result).toHaveLength(2);
      expect(result.map((v) => v.name)).toEqual([
        "Tom Hardy",
        "Clint Eastwood",
      ]);
    });

    it("filters by creditedAs = writer", () => {
      const filterValues: CastAndCrewFiltersValues = {
        creditedAs: "writer",
      };
      const result = filterCastAndCrew(mockValues, filterValues);

      expect(result).toHaveLength(2);
      expect(result.map((v) => v.name)).toEqual([
        "Christopher Nolan",
        "Aaron Sorkin",
      ]);
    });

    it("filters by name", () => {
      const filterValues: CastAndCrewFiltersValues = {
        name: "hardy",
      };
      const result = filterCastAndCrew(mockValues, filterValues);

      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe("Tom Hardy");
    });

    it("filters by creditedAs and name", () => {
      const filterValues: CastAndCrewFiltersValues = {
        creditedAs: "director",
        name: "nolan",
      };
      const result = filterCastAndCrew(mockValues, filterValues);

      expect(result).toHaveLength(1);
      expect(result[0]?.name).toBe("Christopher Nolan");
    });
  });
});

describe("calculateCreditedAsCounts", () => {
  let mockValues: CastAndCrewValue[];

  beforeEach(() => {
    mockValues = [
      {
        avatarImageProps: undefined,
        creditedAs: ["director", "writer"],
        name: "Christopher Nolan",
        reviewCount: 10,
        slug: "christopher-nolan",
      },
      {
        avatarImageProps: undefined,
        creditedAs: ["performer"],
        name: "Tom Hardy",
        reviewCount: 8,
        slug: "tom-hardy",
      },
      {
        avatarImageProps: undefined,
        creditedAs: ["director"],
        name: "Denis Villeneuve",
        reviewCount: 6,
        slug: "denis-villeneuve",
      },
      {
        avatarImageProps: undefined,
        creditedAs: ["writer"],
        name: "Aaron Sorkin",
        reviewCount: 4,
        slug: "aaron-sorkin",
      },
      {
        avatarImageProps: undefined,
        creditedAs: ["performer", "director"],
        name: "Clint Eastwood",
        reviewCount: 12,
        slug: "clint-eastwood",
      },
    ];
  });

  it("calculates counts for all credited roles when no filters applied", () => {
    const filterValues: CastAndCrewFiltersValues = {};
    const counts = calculateCreditedAsCounts(mockValues, filterValues);

    expect(counts.get("director")).toBe(3); // Nolan, Villeneuve, Eastwood
    expect(counts.get("performer")).toBe(2); // Hardy, Eastwood
    expect(counts.get("writer")).toBe(2); // Nolan, Sorkin
  });

  it("excludes creditedAs filter when calculating counts", () => {
    const filterValues: CastAndCrewFiltersValues = {
      creditedAs: "director",
    };
    const counts = calculateCreditedAsCounts(mockValues, filterValues);

    // Should return counts as if creditedAs filter was not applied
    expect(counts.get("director")).toBe(3);
    expect(counts.get("performer")).toBe(2);
    expect(counts.get("writer")).toBe(2);
  });

  it("respects name filter when calculating counts", () => {
    const filterValues: CastAndCrewFiltersValues = {
      name: "nolan",
    };
    const counts = calculateCreditedAsCounts(mockValues, filterValues);

    // Only Christopher Nolan matches
    expect(counts.get("director")).toBe(1);
    expect(counts.get("performer") ?? 0).toBe(0);
    expect(counts.get("writer")).toBe(1);
  });

  it("returns empty counts when no values match filters", () => {
    const filterValues: CastAndCrewFiltersValues = {
      name: "nonexistent",
    };
    const counts = calculateCreditedAsCounts(mockValues, filterValues);

    expect(counts.get("director")).toBeUndefined();
    expect(counts.get("performer")).toBeUndefined();
    expect(counts.get("writer")).toBeUndefined();
  });

  it("handles empty values array", () => {
    const filterValues: CastAndCrewFiltersValues = {};
    const counts = calculateCreditedAsCounts([], filterValues);

    expect(counts.size).toBe(0);
  });
});
