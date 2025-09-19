import { render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { getAvatarList } from "~/components/avatar-list/AvatarList.testHelper";
import {
  fillNameFilter,
  getNameFilter,
} from "~/components/filter-and-sort/CollectionFilters.testHelper";
import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type { CollectionsProps, CollectionsValue } from "./Collections";

import { Collections } from "./Collections";

// Inline minimal fixture data for testing
const createCollection = (
  overrides: Partial<CollectionsValue> = {},
): CollectionsValue => {
  const name = overrides.name || "Test Collection";
  return {
    avatarImageProps: undefined,
    name,
    reviewCount: overrides.reviewCount ?? 10,
    slug: overrides.slug ?? name.toLowerCase().replaceAll(/[\s']/g, "-"),
    ...overrides,
  };
};

const baseProps: CollectionsProps = {
  initialSort: "name-asc",
  values: [],
};

describe("Collections", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("filtering", () => {
    it("filters by name", async ({ expect }) => {
      const collections = [
        createCollection({ name: "Friday the 13th" }),
        createCollection({ name: "Halloween" }),
        createCollection({ name: "Hammer Films" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Collections {...baseProps} values={collections} />);

      await clickToggleFilters(user);
      await fillNameFilter(user, "Friday");
      await clickViewResults(user);

      const avatarList = getAvatarList();
      expect(
        within(avatarList).getByText("Friday the 13th"),
      ).toBeInTheDocument();
      expect(
        within(avatarList).queryByText("Halloween"),
      ).not.toBeInTheDocument();
      expect(
        within(avatarList).queryByText("Hammer Films"),
      ).not.toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("sorts by name A → Z", async ({ expect }) => {
      const collections = [
        createCollection({ name: "Universal Monsters" }),
        createCollection({ name: "Friday the 13th" }),
        createCollection({ name: "Hammer Films" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Collections {...baseProps} values={collections} />);

      await clickSortOption(user, "Name (A → Z)");

      const avatarList = getAvatarList();
      const allText = avatarList.textContent || "";
      const fridayIndex = allText.indexOf("Friday the 13th");
      const hammerIndex = allText.indexOf("Hammer Films");
      const universalIndex = allText.indexOf("Universal Monsters");

      expect(fridayIndex).toBeLessThan(hammerIndex);
      expect(hammerIndex).toBeLessThan(universalIndex);
    });

    it("sorts by name Z → A", async ({ expect }) => {
      const collections = [
        createCollection({ name: "Friday the 13th" }),
        createCollection({ name: "Hammer Films" }),
        createCollection({ name: "Universal Monsters" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Collections {...baseProps} values={collections} />);

      await clickSortOption(user, "Name (Z → A)");

      const avatarList = getAvatarList();
      const allText = avatarList.textContent || "";
      const universalIndex = allText.indexOf("Universal Monsters");
      const hammerIndex = allText.indexOf("Hammer Films");
      const fridayIndex = allText.indexOf("Friday the 13th");

      expect(universalIndex).toBeLessThan(hammerIndex);
      expect(hammerIndex).toBeLessThan(fridayIndex);
    });

    it("sorts by review count most first", async ({ expect }) => {
      const collections = [
        createCollection({ name: "Friday the 13th", reviewCount: 11 }),
        createCollection({ name: "Halloween", reviewCount: 13 }),
        createCollection({ name: "James Bond", reviewCount: 27 }),
      ];

      const user = getUserWithFakeTimers();
      render(<Collections {...baseProps} values={collections} />);

      await clickSortOption(user, "Review Count (Most First)");

      const avatarList = getAvatarList();
      const allText = avatarList.textContent || "";
      const bondIndex = allText.indexOf("James Bond");
      const halloweenIndex = allText.indexOf("Halloween");
      const fridayIndex = allText.indexOf("Friday the 13th");

      expect(bondIndex).toBeLessThan(halloweenIndex);
      expect(halloweenIndex).toBeLessThan(fridayIndex);
    });

    it("sorts by review count fewest first", async ({ expect }) => {
      const collections = [
        createCollection({ name: "Halloween", reviewCount: 13 }),
        createCollection({ name: "Hatchet", reviewCount: 4 }),
        createCollection({ name: "James Bond", reviewCount: 27 }),
      ];

      const user = getUserWithFakeTimers();
      render(<Collections {...baseProps} values={collections} />);

      await clickSortOption(user, "Review Count (Fewest First)");

      const avatarList = getAvatarList();
      const allText = avatarList.textContent || "";
      const hatchetIndex = allText.indexOf("Hatchet");
      const halloweenIndex = allText.indexOf("Halloween");
      const bondIndex = allText.indexOf("James Bond");

      expect(hatchetIndex).toBeLessThan(halloweenIndex);
      expect(halloweenIndex).toBeLessThan(bondIndex);
    });
  });

  describe("when clearing filters", () => {
    it("clears all filters with clear button", async ({ expect }) => {
      const collections = [
        createCollection({ name: "Universal Monsters" }),
        createCollection({ name: "Hammer Films" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Collections {...baseProps} values={collections} />);

      // Apply name filter
      await clickToggleFilters(user);
      await fillNameFilter(user, "Universal");
      await clickViewResults(user);

      let avatarList = getAvatarList();
      expect(
        within(avatarList).getByText("Universal Monsters"),
      ).toBeInTheDocument();
      expect(
        within(avatarList).queryByText("Hammer Films"),
      ).not.toBeInTheDocument();

      // Clear filters
      await clickToggleFilters(user);
      await clickClearFilters(user);

      // Check that filters are cleared
      expect(getNameFilter()).toHaveValue("");

      await clickViewResults(user);

      // All collections should be visible
      avatarList = getAvatarList();
      expect(
        within(avatarList).getByText("Universal Monsters"),
      ).toBeInTheDocument();
      expect(within(avatarList).getByText("Hammer Films")).toBeInTheDocument();
    });
  });

  describe("when closing filter drawer without applying", () => {
    it("resets pending filter changes", async ({ expect }) => {
      const collections = [
        createCollection({ name: "Universal Monsters" }),
        createCollection({ name: "Hammer Films" }),
      ];

      const user = getUserWithFakeTimers();
      render(<Collections {...baseProps} values={collections} />);

      // Apply initial filter
      await clickToggleFilters(user);
      await fillNameFilter(user, "Universal");
      await clickViewResults(user);

      let avatarList = getAvatarList();
      expect(
        within(avatarList).getByText("Universal Monsters"),
      ).toBeInTheDocument();
      expect(
        within(avatarList).queryByText("Hammer Films"),
      ).not.toBeInTheDocument();

      // Start typing new filter but close without applying
      await clickToggleFilters(user);
      await fillNameFilter(user, "Different");
      await clickCloseFilters(user);

      // Original filter should still be active
      avatarList = getAvatarList();
      expect(
        within(avatarList).getByText("Universal Monsters"),
      ).toBeInTheDocument();
      expect(
        within(avatarList).queryByText("Hammer Films"),
      ).not.toBeInTheDocument();

      // Verify original filter value is preserved
      await clickToggleFilters(user);
      expect(getNameFilter()).toHaveValue("Universal");
    });
  });
});
