import { describe, expect, it } from "vitest";

import type { CastAndCrewFiltersValues } from "./CastAndCrew.reducer";

import { buildAppliedFilterChips } from "./appliedFilterChips";

describe("buildAppliedFilterChips", () => {
  it("returns empty array when no filters applied", () => {
    const filterValues: CastAndCrewFiltersValues = {};
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([]);
  });

  it("returns empty array when creditedAs is empty array", () => {
    const filterValues: CastAndCrewFiltersValues = {
      creditedAs: [],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([]);
  });

  it("builds name search chip", () => {
    const filterValues: CastAndCrewFiltersValues = {
      name: "john",
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      displayText: "Search: john",
      key: "name",
    });
  });

  it("excludes name chip when value is empty string", () => {
    const filterValues: CastAndCrewFiltersValues = {
      name: "",
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([]);
  });

  it("excludes name chip when value is whitespace only", () => {
    const filterValues: CastAndCrewFiltersValues = {
      name: "   ",
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toEqual([]);
  });

  it("builds creditedAs chip for director", () => {
    const filterValues: CastAndCrewFiltersValues = {
      creditedAs: ["director"],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      displayText: "Director",
      key: "creditedAs-director",
      value: "director",
    });
  });

  it("builds creditedAs chip for performer", () => {
    const filterValues: CastAndCrewFiltersValues = {
      creditedAs: ["performer"],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      displayText: "Performer",
      key: "creditedAs-performer",
      value: "performer",
    });
  });

  it("builds creditedAs chip for writer", () => {
    const filterValues: CastAndCrewFiltersValues = {
      creditedAs: ["writer"],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(1);
    expect(chips[0]).toEqual({
      displayText: "Writer",
      key: "creditedAs-writer",
      value: "writer",
    });
  });

  it("builds multiple creditedAs chips", () => {
    const filterValues: CastAndCrewFiltersValues = {
      creditedAs: ["director", "writer"],
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(2);
    expect(chips[0]).toEqual({
      displayText: "Director",
      key: "creditedAs-director",
      value: "director",
    });
    expect(chips[1]).toEqual({
      displayText: "Writer",
      key: "creditedAs-writer",
      value: "writer",
    });
  });

  it("builds both name and creditedAs chips", () => {
    const filterValues: CastAndCrewFiltersValues = {
      creditedAs: ["director"],
      name: "christopher nolan",
    };
    const chips = buildAppliedFilterChips(filterValues);

    expect(chips).toHaveLength(2);
    expect(chips[0]).toEqual({
      displayText: "Search: christopher nolan",
      key: "name",
    });
    expect(chips[1]).toEqual({
      displayText: "Director",
      key: "creditedAs-director",
      value: "director",
    });
  });
});
