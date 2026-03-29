import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, vi } from "vitest";

import { getAvatarList } from "~/components/avatar-list/AvatarList.testHelper";
import { nameFilterTests } from "~/components/filter-and-sort/facets/name/nameFilterTests";
import { nameSortTests } from "~/components/filter-and-sort/facets/name/nameSortTests";
import { reviewCountSortTests } from "~/components/filter-and-sort/facets/review-count/reviewCountSortTests";

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
    sortName: name,
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

  nameSortTests(
    (items) =>
      render(
        <Collections
          {...baseProps}
          values={items.map((item) => createCollection(item))}
        />,
      ),
    getAvatarList,
  );

  nameFilterTests(
    (items) =>
      render(
        <Collections
          {...baseProps}
          values={items.map((item) => createCollection(item))}
        />,
      ),
    getAvatarList,
  );

  reviewCountSortTests(
    (items) =>
      render(
        <Collections
          {...baseProps}
          values={items.map((item) => createCollection(item))}
        />,
      ),
    getAvatarList,
  );
});
