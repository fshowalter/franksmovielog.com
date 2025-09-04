import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/ListWithFilters/ListWithFilters.testHelper";
import { clickReviewedStatusFilterOption } from "~/components/ListWithFilters/ReviewedStatusFilter.testHelper";
import {
  fillReleaseYearFilter,
  fillTitleFilter,
  getTitleFilter,
} from "~/components/ListWithFilters/TitleFilters.testHelper";
import { getUserWithFakeTimers } from "~/components/utils/testUtils";

import { getProps } from "./getProps";
import { Viewings } from "./Viewings";
import {
  clickMediumFilterOption,
  clickNextMonthButton,
  clickPreviousMonthButton,
  clickVenueFilterOption,
  fillViewingYearFilter,
  getCalendar,
  getMediumFilter,
  queryNextMonthButton,
  queryPreviousMonthButton,
} from "./Viewings.testHelper";

export const props = await getProps();

describe("Viewings", () => {
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

  it("renders", ({ expect }) => {
    const { asFragment } = render(<Viewings {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("can filter by title", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Type the filter text
    await fillTitleFilter(user, "Curse");

    await clickViewResults(user);

    // Calendar updates synchronously with fake timers
    expect(getCalendar()).toMatchSnapshot();
  });

  it("can filter by medium", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    await clickToggleFilters(user);

    await clickMediumFilterOption(user, "Blu-ray");

    // Apply the filter
    await clickViewResults(user);

    // Calendar updates synchronously with fake timers
    expect(getCalendar()).toMatchSnapshot();
  });

  it("can filter reviewed titles", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    await clickToggleFilters(user);

    await clickReviewedStatusFilterOption(user, "Reviewed");

    // Apply the filter
    await clickViewResults(user);

    expect(getCalendar()).toMatchSnapshot();
  });

  it("can show unreviewed titles", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    await clickToggleFilters(user);

    await clickReviewedStatusFilterOption(user, "Not Reviewed");

    // Apply the filter
    await clickViewResults(user);

    expect(getCalendar()).toMatchSnapshot();
  });

  it("can filter not reviewed then show all titles", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    await clickToggleFilters(user);

    await clickReviewedStatusFilterOption(user, "Not Reviewed");

    // Apply the filter
    await clickViewResults(user);

    await clickToggleFilters(user);

    await clickReviewedStatusFilterOption(user, "All");

    await clickViewResults(user);

    expect(getCalendar()).toMatchSnapshot();
  });

  it("can filter by medium then show all", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    await clickToggleFilters(user);

    await clickMediumFilterOption(user, "Blu-ray");

    // Apply the filter
    await clickViewResults(user);

    // Open filter drawer again
    await clickToggleFilters(user);

    await clickMediumFilterOption(user, "All");

    // Apply the filter
    await clickViewResults(user);

    // Calendar updates synchronously with fake timers

    expect(getCalendar()).toMatchSnapshot();
  });

  it("can filter by venue", async ({ expect }) => {
    expect.hasAssertions();
    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    await clickToggleFilters(user);

    await clickVenueFilterOption(user, "Alamo Drafthouse Cinema - One Loudoun");

    // Apply the filter
    await clickViewResults(user);

    // Calendar updates synchronously with fake timers
    expect(getCalendar()).toMatchSnapshot();
  });

  it("can filter by venue then show all", async ({ expect }) => {
    expect.hasAssertions();
    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    await clickToggleFilters(user);

    await clickVenueFilterOption(user, "Alamo Drafthouse Cinema - One Loudoun");

    // Apply the filter
    await clickViewResults(user);

    // Open filter drawer again
    await clickToggleFilters(user);

    await clickVenueFilterOption(user, "All");

    // Apply the filter
    await clickViewResults(user);

    // Calendar updates synchronously with fake timers
    expect(getCalendar()).toMatchSnapshot();
  });

  it("can sort by viewing date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    await clickSortOption(user, "Viewing Date (Newest First)");

    expect(getCalendar()).toMatchSnapshot();
  });

  it("can sort by viewing date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    await clickSortOption(user, "Viewing Date (Oldest First)");

    expect(getCalendar()).toMatchSnapshot();
  });

  it("can filter by release year", async ({ expect }) => {
    expect.hasAssertions();
    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    await clickToggleFilters(user);

    await fillReleaseYearFilter(user, "1957", "1970");

    // Apply the filter
    await clickViewResults(user);

    // Calendar updates synchronously with fake timers
    expect(getCalendar()).toMatchSnapshot();
  });

  it("can filter by release year reversed", async ({ expect }) => {
    expect.hasAssertions();
    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    await clickToggleFilters(user);

    await fillReleaseYearFilter(user, "1950", "1957");

    // Apply the filter
    await clickViewResults(user);

    await clickToggleFilters(user);

    await fillReleaseYearFilter(user, "1973", "1950");

    // Apply the filter
    await clickViewResults(user);

    // Calendar updates synchronously with fake timers
    expect(getCalendar()).toMatchSnapshot();
  });

  it("can filter by viewing year", async ({ expect }) => {
    expect.hasAssertions();
    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    await clickToggleFilters(user);

    await fillViewingYearFilter(user, "2012", "2012");

    // Apply the filter
    await clickViewResults(user);

    // Calendar updates synchronously with fake timers
    expect(getCalendar()).toMatchSnapshot();
  });

  it("can filter by viewing year reversed", async ({ expect }) => {
    expect.hasAssertions();
    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    await clickToggleFilters(user);

    await fillViewingYearFilter(user, "2012", "2014");

    // Apply the filter
    await clickViewResults(user);

    await clickToggleFilters(user);

    await fillViewingYearFilter(user, "2013", "2012");

    // Apply the filter
    await clickViewResults(user);

    // Calendar updates synchronously with fake timers
    expect(getCalendar()).toMatchSnapshot();
  });

  it("can navigate to previous month", async ({ expect }) => {
    expect.hasAssertions();
    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    // Sort by oldest first to ensure we have a next month button
    await clickSortOption(user, "Viewing Date (Newest First)");

    await clickPreviousMonthButton(user);

    expect(getCalendar()).toMatchSnapshot();
  });

  it("can navigate to next month", async ({ expect }) => {
    expect.hasAssertions();
    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    // Sort by oldest first to ensure we have a next month button
    await clickSortOption(user, "Viewing Date (Oldest First)");

    await clickNextMonthButton(user);

    expect(getCalendar()).toMatchSnapshot();
  });

  it("shows correct month navigation buttons", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    // Default sort is newest first, should show previous month button
    const prevMonthButton = queryPreviousMonthButton();
    const nextMonthButton = queryNextMonthButton();

    // At newest month, should only have previous month button
    expect(prevMonthButton).toBeInTheDocument();
    expect(nextMonthButton).not.toBeInTheDocument();

    // Sort by oldest first
    await clickSortOption(user, "Viewing Date (Oldest First)");

    // At oldest month, should only have next month button
    const prevMonthButtonAfterSort = queryPreviousMonthButton();
    const nextMonthButtonAfterSort = queryNextMonthButton();

    expect(prevMonthButtonAfterSort).not.toBeInTheDocument();
    expect(nextMonthButtonAfterSort).toBeInTheDocument();
  });

  it("can clear all filters", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply multiple filters
    await fillTitleFilter(user, "Rio Bravo");

    await clickMediumFilterOption(user, "Blu-ray");

    await clickViewResults(user);

    const listBeforeClear = getCalendar().innerHTML;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Clear all filters
    await clickClearFilters(user);

    // Check that filters are cleared
    expect(getTitleFilter()).toHaveValue("");
    expect(getMediumFilter()).toHaveValue("All");

    await clickViewResults(user);

    const listAfterClear = getCalendar().innerHTML;

    expect(listBeforeClear).not.toEqual(listAfterClear);
  });

  it("can reset filters when closing drawer", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Viewings {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply initial filter
    await fillTitleFilter(user, "Curse");

    // Apply the filters
    await clickViewResults(user);

    // Store the current view
    const listBeforeReset = getCalendar().innerHTML;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Start typing a new filter but don't apply
    await fillTitleFilter(user, "Different Movie");

    // Close the drawer with the X button (should reset pending changes)
    await clickCloseFilters(user);

    // The view should still show the originally filtered results
    const listAfterReset = getCalendar().innerHTML;

    expect(listBeforeReset).toEqual(listAfterReset);

    // Open filter drawer again to verify filters were reset to last applied state
    await clickToggleFilters(user);

    // Should show the originally applied filter, not the pending change
    expect(getTitleFilter()).toHaveValue("Curse");
  });
});
