import { render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { getGroupedAvatarList } from "~/components/avatar-list/AvatarList.testHelper";
import {
  fillNameFilter,
  getNameFilter,
} from "~/components/filter-and-sort/CollectionFilters.testHelper";
import {
  clickCreditedAsFilterOption,
  getCreditedAsFilter,
} from "~/components/filter-and-sort/CreditedAsFilter.testHelper";
import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type { CastAndCrewProps, CastAndCrewValue } from "./CastAndCrew";

import { CastAndCrew } from "./CastAndCrew";

// Inline minimal fixture data for testing
const createCastAndCrewMember = (
  overrides: Partial<CastAndCrewValue> = {},
): CastAndCrewValue => {
  const name = overrides.name || "Test Person";
  return {
    avatarImageProps: undefined,
    creditedAs: ["director"],
    name,
    reviewCount: 5,
    slug: name.toLowerCase().replaceAll(/\s+/g, "-"),
    ...overrides,
  };
};

const baseProps: CastAndCrewProps = {
  initialSort: "name-asc",
  values: [],
};

describe("CastAndCrew", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("filtering", () => {
    it("filters by name", async ({ expect }) => {
      const members = [
        createCastAndCrewMember({ name: "John Wayne" }),
        createCastAndCrewMember({ name: "John Ford" }),
        createCastAndCrewMember({ name: "Howard Hawks" }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrew {...baseProps} values={members} />);

      await clickToggleFilters(user);
      await fillNameFilter(user, "John");
      await clickViewResults(user);

      const avatarList = getGroupedAvatarList();

      // Only names containing "John" should be visible
      expect(within(avatarList).getByText("John Wayne")).toBeInTheDocument();
      expect(within(avatarList).getByText("John Ford")).toBeInTheDocument();
      expect(
        within(avatarList).queryByText("Howard Hawks"),
      ).not.toBeInTheDocument();
    });

    it("filters by credited as", async ({ expect }) => {
      const members = [
        createCastAndCrewMember({
          creditedAs: ["director"],
          name: "Steven Spielberg",
        }),
        createCastAndCrewMember({
          creditedAs: ["performer"],
          name: "Tom Hanks",
        }),
        createCastAndCrewMember({
          creditedAs: ["writer"],
          name: "Charlie Kaufman",
        }),
        createCastAndCrewMember({
          creditedAs: ["director", "writer"],
          name: "Christopher Nolan",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrew {...baseProps} values={members} />);

      await clickToggleFilters(user);
      await clickCreditedAsFilterOption(user, "director");
      await clickViewResults(user);

      const avatarList = getGroupedAvatarList();

      // Only directors should be visible
      expect(
        within(avatarList).getByText("Steven Spielberg"),
      ).toBeInTheDocument();
      expect(
        within(avatarList).getByText("Christopher Nolan"),
      ).toBeInTheDocument(); // Both director and writer
      expect(
        within(avatarList).queryByText("Tom Hanks"),
      ).not.toBeInTheDocument();
      expect(
        within(avatarList).queryByText("Charlie Kaufman"),
      ).not.toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("sorts by name A → Z", async ({ expect }) => {
      const members = [
        createCastAndCrewMember({ name: "Zoe Saldana" }),
        createCastAndCrewMember({ name: "Alfred Hitchcock" }),
        createCastAndCrewMember({ name: "Martin Scorsese" }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrew {...baseProps} values={members} />);

      await clickSortOption(user, "Name (A → Z)");

      const avatarList = getGroupedAvatarList();

      // Check that names appear in alphabetical order
      const allText = avatarList.textContent || "";
      const alfredIndex = allText.indexOf("Alfred Hitchcock");
      const martinIndex = allText.indexOf("Martin Scorsese");
      const zoeIndex = allText.indexOf("Zoe Saldana");

      expect(alfredIndex).toBeLessThan(martinIndex);
      expect(martinIndex).toBeLessThan(zoeIndex);
    });

    it("sorts by name Z → A", async ({ expect }) => {
      const members = [
        createCastAndCrewMember({ name: "Alfred Hitchcock" }),
        createCastAndCrewMember({ name: "Martin Scorsese" }),
        createCastAndCrewMember({ name: "Zoe Saldana" }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrew {...baseProps} values={members} />);

      await clickSortOption(user, "Name (Z → A)");

      const avatarList = getGroupedAvatarList();

      // Check that names appear in reverse alphabetical order
      const allText = avatarList.textContent || "";
      const zoeIndex = allText.indexOf("Zoe Saldana");
      const martinIndex = allText.indexOf("Martin Scorsese");
      const alfredIndex = allText.indexOf("Alfred Hitchcock");

      expect(zoeIndex).toBeLessThan(martinIndex);
      expect(martinIndex).toBeLessThan(alfredIndex);
    });

    it("sorts by review count most first", async ({ expect }) => {
      const members = [
        createCastAndCrewMember({ name: "John Ford", reviewCount: 5 }),
        createCastAndCrewMember({ name: "Howard Hawks", reviewCount: 15 }),
        createCastAndCrewMember({ name: "Alfred Hitchcock", reviewCount: 10 }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrew {...baseProps} values={members} />);

      await clickSortOption(user, "Review Count (Most First)");

      const avatarList = getGroupedAvatarList();

      // Check that names appear in descending review count order
      const allText = avatarList.textContent || "";
      const howardIndex = allText.indexOf("Howard Hawks");
      const alfredIndex = allText.indexOf("Alfred Hitchcock");
      const johnIndex = allText.indexOf("John Ford");

      expect(howardIndex).toBeLessThan(alfredIndex);
      expect(alfredIndex).toBeLessThan(johnIndex);
    });

    it("sorts by review count fewest first", async ({ expect }) => {
      const members = [
        createCastAndCrewMember({ name: "Howard Hawks", reviewCount: 15 }),
        createCastAndCrewMember({ name: "John Ford", reviewCount: 5 }),
        createCastAndCrewMember({ name: "Alfred Hitchcock", reviewCount: 10 }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrew {...baseProps} values={members} />);

      await clickSortOption(user, "Review Count (Fewest First)");

      const avatarList = getGroupedAvatarList();

      // Check that names appear in ascending review count order
      const allText = avatarList.textContent || "";
      const johnIndex = allText.indexOf("John Ford");
      const alfredIndex = allText.indexOf("Alfred Hitchcock");
      const howardIndex = allText.indexOf("Howard Hawks");

      expect(johnIndex).toBeLessThan(alfredIndex);
      expect(alfredIndex).toBeLessThan(howardIndex);
    });
  });

  describe("when clearing filters", () => {
    it("clears all filters with clear button", async ({ expect }) => {
      const members = [
        createCastAndCrewMember({
          creditedAs: ["director"],
          name: "John Ford",
        }),
        createCastAndCrewMember({
          creditedAs: ["director"],
          name: "Howard Hawks",
        }),
        createCastAndCrewMember({
          creditedAs: ["performer"],
          name: "Tom Hanks",
        }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrew {...baseProps} values={members} />);

      // Apply multiple filters
      await clickToggleFilters(user);
      await fillNameFilter(user, "John");
      await clickCreditedAsFilterOption(user, "director");
      await clickViewResults(user);

      let avatarList = getGroupedAvatarList();
      expect(within(avatarList).getByText("John Ford")).toBeInTheDocument();
      expect(
        within(avatarList).queryByText("Howard Hawks"),
      ).not.toBeInTheDocument();
      expect(
        within(avatarList).queryByText("Tom Hanks"),
      ).not.toBeInTheDocument();

      // Clear filters
      await clickToggleFilters(user);
      await clickClearFilters(user);

      // Check that all filters are cleared
      expect(getNameFilter()).toHaveValue("");
      expect(getCreditedAsFilter()).toEqual([]);

      await clickViewResults(user);

      // All members should be visible
      avatarList = getGroupedAvatarList();
      expect(within(avatarList).getByText("John Ford")).toBeInTheDocument();
      expect(within(avatarList).getByText("Howard Hawks")).toBeInTheDocument();
      expect(within(avatarList).getByText("Tom Hanks")).toBeInTheDocument();
    });
  });

  describe("when closing filter drawer without applying", () => {
    it("resets pending filter changes", async ({ expect }) => {
      const members = [
        createCastAndCrewMember({ name: "John Ford" }),
        createCastAndCrewMember({ name: "Howard Hawks" }),
      ];

      const user = getUserWithFakeTimers();
      render(<CastAndCrew {...baseProps} values={members} />);

      // Apply initial filter
      await clickToggleFilters(user);
      await fillNameFilter(user, "John");
      await clickViewResults(user);

      let avatarList = getGroupedAvatarList();
      expect(within(avatarList).getByText("John Ford")).toBeInTheDocument();
      expect(
        within(avatarList).queryByText("Howard Hawks"),
      ).not.toBeInTheDocument();

      // Start typing new filter but close without applying
      await clickToggleFilters(user);
      await fillNameFilter(user, "Different");
      await clickCloseFilters(user);

      // Original filter should still be active
      avatarList = getGroupedAvatarList();
      expect(within(avatarList).getByText("John Ford")).toBeInTheDocument();
      expect(
        within(avatarList).queryByText("Howard Hawks"),
      ).not.toBeInTheDocument();

      // Verify original filter value is preserved
      await clickToggleFilters(user);
      expect(getNameFilter()).toHaveValue("John");
    });
  });
});
