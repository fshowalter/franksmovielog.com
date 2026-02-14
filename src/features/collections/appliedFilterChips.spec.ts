import { describe, expect, it } from "vitest";

import type { CollectionsFiltersValues } from "./Collections.reducer";

import { buildAppliedFilterChips } from "./appliedFilterChips";

describe("buildAppliedFilterChips", () => {
  describe("when no filters are active", () => {
    it("returns empty array", () => {
      const filterValues: CollectionsFiltersValues = {};

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([]);
    });
  });

  describe("name filter", () => {
    it("creates chip when name filter is set", () => {
      const filterValues: CollectionsFiltersValues = {
        name: "horror",
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([
        {
          category: "Search",
          id: "name",
          label: "horror",
        },
      ]);
    });

    it("does not create chip when name is empty string", () => {
      const filterValues: CollectionsFiltersValues = {
        name: "",
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([]);
    });

    it("does not create chip when name is only whitespace", () => {
      const filterValues: CollectionsFiltersValues = {
        name: "   ",
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([]);
    });

    it("preserves name value exactly as entered", () => {
      const filterValues: CollectionsFiltersValues = {
        name: "The Alien Collection",
      };

      const result = buildAppliedFilterChips(filterValues);

      expect(result).toEqual([
        {
          category: "Search",
          id: "name",
          label: "The Alien Collection",
        },
      ]);
    });
  });
});
