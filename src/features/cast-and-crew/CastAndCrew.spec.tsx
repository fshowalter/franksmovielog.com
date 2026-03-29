import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, vi } from "vitest";

import { getGroupedAvatarList } from "~/components/avatar-list/AvatarList.testHelper";
import { creditedAsFilterTests } from "~/components/filter-and-sort/facets/credited-as/creditedAsFilterTests";
import { nameFilterTests } from "~/components/filter-and-sort/facets/name/nameFilterTests";
import { nameSortTests } from "~/components/filter-and-sort/facets/name/nameSortTests";
import { reviewCountSortTests } from "~/components/filter-and-sort/facets/review-count/reviewCountSortTests";

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

  nameFilterTests(
    (items) =>
      render(<CastAndCrew {...baseProps} values={createMembers(items)} />),
    getGroupedAvatarList,
  );
  creditedAsFilterTests(
    (items) =>
      render(<CastAndCrew {...baseProps} values={createMembers(items)} />),
    getGroupedAvatarList,
  );

  nameSortTests(
    (items) =>
      render(<CastAndCrew {...baseProps} values={createMembers(items)} />),
    getGroupedAvatarList,
  );

  reviewCountSortTests(
    (items) =>
      render(<CastAndCrew {...baseProps} values={createMembers(items)} />),
    getGroupedAvatarList,
  );
});
