import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { getGroupedAvatarList } from "~/components/AvatarList.testHelper";
import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/ListWithFilters/ListWithFilters.testHelper";
import { clickSelectField } from "~/components/SelectField.testHelper";
import { fillTextFilter } from "~/components/TextFilter.testHelper";
import { getUserWithFakeTimers } from "~/components/utils/testUtils";

import { CastAndCrew } from "./CastAndCrew";
import { getProps } from "./getProps";

const props = await getProps();

describe("CastAndCrew", () => {
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

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrew {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Type the filter text
    await fillTextFilter(user, "Name", "John Wayne");

    // Apply the filter
    await clickViewResults(user);

    // List updates synchronously with fake timers
    expect(getGroupedAvatarList()).toMatchSnapshot();
  });

  it("can sort by name desc", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrew {...props} />);

    await clickSortOption(user, "Name (Z → A)");

    expect(getGroupedAvatarList()).toMatchSnapshot();
  });

  it("can sort by name asc", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrew {...props} />);

    await clickSortOption(user, "Name (A → Z)");

    expect(getGroupedAvatarList()).toMatchSnapshot();
  });

  it("can sort by review count desc", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrew {...props} />);

    await clickSortOption(user, "Review Count (Most First)");

    expect(getGroupedAvatarList()).toMatchSnapshot();
  });

  it("can sort by review count asc", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrew {...props} />);

    await clickSortOption(user, "Review Count (Fewest First)");

    expect(getGroupedAvatarList()).toMatchSnapshot();
  });

  it("can filter directors", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrew {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await clickSelectField(user, "Credits", "Director");

    // Apply the filter
    await clickViewResults(user);

    // List updates synchronously with fake timers
    expect(getGroupedAvatarList()).toMatchSnapshot();
  });

  it("can filter directors then show all", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrew {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await clickSelectField(user, "Credits", "Director");

    // Apply the filter
    await clickViewResults(user);

    // Open filter drawer again
    await clickToggleFilters(user);

    await clickSelectField(user, "Credits", "All");

    // Apply the filter
    await clickViewResults(user);

    // List updates synchronously with fake timers
    expect(getGroupedAvatarList()).toMatchSnapshot();
  });

  it("can filter writers", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrew {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await clickSelectField(user, "Credits", "Writer");

    // Apply the filter
    await clickViewResults(user);

    // List updates synchronously with fake timers

    expect(getGroupedAvatarList()).toMatchSnapshot();
  });

  it("can filter writers then show all", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrew {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await clickSelectField(user, "Credits", "Writer");

    // Apply the filter
    await clickViewResults(user);

    // Open filter drawer again
    await clickToggleFilters(user);

    await clickSelectField(user, "Credits", "All");

    // Apply the filter
    await clickViewResults(user);

    // List updates synchronously with fake timers
    expect(getGroupedAvatarList()).toMatchSnapshot();
  });

  it("can filter performers", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrew {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await clickSelectField(user, "Credits", "Performer");

    // Apply the filter
    await clickViewResults(user);

    // List updates synchronously with fake timers

    expect(getGroupedAvatarList()).toMatchSnapshot();
  });

  it("can filter performers then show all", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrew {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await clickSelectField(user, "Credits", "Performer");

    // Apply the filter
    await clickViewResults(user);

    // Open filter drawer again
    await clickToggleFilters(user);

    await clickSelectField(user, "Credits", "All");

    // Apply the filter
    await clickViewResults(user);

    // List updates synchronously with fake timers

    expect(getGroupedAvatarList()).toMatchSnapshot();
  });

  it("can clear all filters", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrew {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply multiple filters
    await fillTextFilter(user, "Name", "John");

    await clickSelectField(user, "Credits", "Director");

    await clickViewResults(user);

    // Open filter drawer again
    await clickToggleFilters(user);

    // Clear all filters
    await clickClearFilters(user);

    // Check that filters are cleared
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Credits")).toHaveValue("All");

    await clickViewResults(user);

    expect(getGroupedAvatarList()).toMatchSnapshot();
  });

  it("can reset filters when closing drawer", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrew {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply initial filter
    await fillTextFilter(user, "Name", "John");

    // Apply the filters
    await clickViewResults(user);

    // Store the count of filtered results
    const filteredList = getGroupedAvatarList();

    const filteredCount =
      within(filteredList).queryAllByRole("listitem").length;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Start typing a new filter but don't apply
    await fillTextFilter(user, "Name", "Different");

    // Close the drawer with the X button (should reset pending changes)
    await clickCloseFilters(user);

    // The list should still show the originally filtered results
    const listAfterReset = getGroupedAvatarList();
    const resetCount = within(listAfterReset).queryAllByRole("listitem").length;
    expect(resetCount).toBe(filteredCount);

    // Open filter drawer again to verify filters were reset to last applied state
    await clickToggleFilters(user);

    // Should show the originally applied filter, not the pending change
    expect(screen.getByLabelText("Name")).toHaveValue("John");
  });
});
