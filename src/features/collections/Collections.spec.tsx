import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { getAvatarList } from "~/components/AvatarList.testHelper";
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
import { getUserWithFakeTimers } from "~/components/utils/testUtils";

import { CollectionsStrictWrapper } from "./Collections";
import { getProps } from "./getProps";

const props = await getProps();

describe("Collections", () => {
  beforeEach(() => {
    // AIDEV-NOTE: Using shouldAdvanceTime: true prevents userEvent from hanging
    // when fake timers are active. This allows async userEvent operations to complete
    // while still controlling timer advancement for debounced inputs.
    // See https://github.com/testing-library/user-event/issues/833
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    // AIDEV-NOTE: Clear all pending timers before restoring real timers
    // to ensure test isolation and prevent timer leaks between tests
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("can filter by name", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<CollectionsStrictWrapper props={props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Type the filter text
    await fillNameFilter(user, "Friday the 13th");

    // Apply the filter
    await clickViewResults(user);

    // List updates synchronously with fake timers
    expect(getAvatarList()).toMatchSnapshot();
  });

  it("can sort by name desc", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<CollectionsStrictWrapper props={props} />);

    await clickSortOption(user, "Name (Z → A)");

    expect(getAvatarList()).toMatchSnapshot();
  });

  it("can sort by name asc", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<CollectionsStrictWrapper props={props} />);

    await clickSortOption(user, "Name (A → Z)");

    expect(getAvatarList()).toMatchSnapshot();
  });

  it("can sort by review count desc", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<CollectionsStrictWrapper props={props} />);

    await clickSortOption(user, "Review Count (Most First)");

    expect(getAvatarList()).toMatchSnapshot();
  });

  it("can sort by review count asc", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<CollectionsStrictWrapper props={props} />);

    await clickSortOption(user, "Review Count (Fewest First)");

    expect(getAvatarList()).toMatchSnapshot();
  });

  it("can clear all filters", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<CollectionsStrictWrapper props={props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply filter
    await fillNameFilter(user, "Universal");

    await clickViewResults(user);

    const listBeforeClear = getAvatarList().innerHTML;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Clear all filters
    await clickClearFilters(user);

    // Check that filters are cleared
    expect(getNameFilter()).toHaveValue("");

    await clickViewResults(user);

    const listAfterClear = getAvatarList().innerHTML;

    expect(listBeforeClear).not.toEqual(listAfterClear);
  });

  it("can reset filters when closing drawer", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<CollectionsStrictWrapper props={props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply filter
    await fillNameFilter(user, "Universal");

    await clickViewResults(user);

    const listBeforeReset = getAvatarList().innerHTML;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Start typing a new filter but don't apply
    await user.clear(getNameFilter());
    await fillNameFilter(user, "Different");

    // Close the drawer with the X button (should reset pending changes)
    await clickCloseFilters(user);

    // The list should still show the originally filtered results
    const listAfterReset = getAvatarList().innerHTML;

    expect(listBeforeReset).toEqual(listAfterReset);

    // Open filter drawer again to verify filters were reset to last applied state
    await clickToggleFilters(user);

    // Should show the originally applied filter, not the pending change
    expect(getNameFilter()).toHaveValue("Universal");
  });
});
