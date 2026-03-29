import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { getGroupedAvatarList } from "~/components/avatar-list/AvatarList.testHelper";
import { clickSortOption } from "~/components/filter-and-sort/container/FilterAndSortContainer.testHelper";
import { creditedAsFilterFacetTests } from "~/components/filter-and-sort/facets/credited-as/creditedAsFacetTests";
import {
  nameFacetFilterTests,
  nameFacetSortTests,
} from "~/components/filter-and-sort/facets/name/nameFacetTests";
import { getUserWithFakeTimers } from "~/utils/getUserWithFakeTimers";

import type { CastAndCrewProps, CastAndCrewValue } from "./CastAndCrew";

import { CastAndCrew } from "./CastAndCrew";

// Inline minimal fixture data for testing
const createMembers = (
  overrides: Partial<CastAndCrewValue>[],
): CastAndCrewValue[] => {
  return overrides.map((override) => {
    const name = override.name || "Test Person";
    return {
      avatarImageProps: undefined,
      creditedAs: ["director"],
      name,
      reviewCount: 5,
      slug: name.toLowerCase().replaceAll(/\s+/g, "-"),
      sortName: name,
      ...override,
    };
  });
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

  nameFacetFilterTests((items) =>
    render(<CastAndCrew {...baseProps} values={createMembers(items)} />),
  );
  creditedAsFilterFacetTests(
    (items) =>
      render(<CastAndCrew {...baseProps} values={createMembers(items)} />),
    getGroupedAvatarList,
  );

  describe("sorting", () => {
    nameFacetSortTests(
      (items) =>
        render(<CastAndCrew {...baseProps} values={createMembers(items)} />),
      getGroupedAvatarList,
    );

    it("sorts by review count most first", async ({ expect }) => {
      const members = createMembers([
        { name: "John Ford", reviewCount: 5 },
        { name: "Howard Hawks", reviewCount: 15 },
        { name: "Alfred Hitchcock", reviewCount: 10 },
      ]);

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
      const members = createMembers([
        { name: "John Ford", reviewCount: 5 },
        { name: "Howard Hawks", reviewCount: 15 },
        { name: "Alfred Hitchcock", reviewCount: 10 },
      ]);

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
});
