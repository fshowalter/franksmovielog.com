import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/ListWithFilters/ListWithFilters.testHelper";
import { clickMultiSelectField } from "~/components/MultiSelectField.testHelper";
import { clickReviewedStatus } from "~/components/ReviewStatusField.testHelper";
import { fillTextFilter } from "~/components/TextFilter.testHelper";
import { getUserWithFakeTimers } from "~/components/utils/testUtils";
import { fillYearInput } from "~/components/YearInput.testHelper";

import { CastAndCrewMember } from "./CastAndCrewMember";
import { getProps } from "./getProps";

const props = await getProps("burt-reynolds");

describe("CastAndCrewMember", () => {
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
    expect.hasAssertions();

    const { asFragment } = render(<CastAndCrewMember {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("can filter by title", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Type the filter text
    await fillTextFilter(user, "Title", "Cannonball");

    // Apply the filter
    await clickViewResults(user);

    // List updates synchronously with fake timers
    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by genres", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await clickMultiSelectField(user, "Genres", "Action");

    // Click to open the dropdown again
    await clickMultiSelectField(user, "Genres", "Comedy");

    await clickViewResults(user);

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by title A → Z", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickSortOption(user, "Title (A → Z)");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by title Z → A", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickSortOption(user, "Title (Z → A)");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by release date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickSortOption(user, "Release Date (Oldest First)");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by release date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickSortOption(user, "Release Date (Newest First)");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by grade with best first", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickSortOption(user, "Grade (Best First)");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickSortOption(user, "Grade (Worst First)");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by review date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickSortOption(user, "Review Date (Oldest First)");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by review date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickSortOption(user, "Review Date (Newest First)");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by release year", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await fillYearInput(user, "Release Year", "1970", "1980");

    // Apply the filter
    await clickViewResults(user);

    // List updates synchronously with fake timers

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by review year", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await fillYearInput(user, "Review Year", "2021", "2022");

    // Apply the filter
    await clickViewResults(user);

    // List updates synchronously with fake timers

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });
  it("can filter reviewed titles", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickReviewedStatus(user, "Reviewed");

    // Apply the filter
    await clickViewResults(user);

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter unreviewed titles", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickReviewedStatus(user, "Not Reviewed");

    // Apply the filter
    await clickViewResults(user);

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter all reviewed status titles", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickReviewedStatus(user, "Not Reviewed");

    // Apply the filter
    await clickViewResults(user);

    await clickReviewedStatus(user, "All");

    // Apply the filter
    await clickViewResults(user);

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter director titles", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await user.selectOptions(screen.getByLabelText("Credits"), "Director");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter director titles then show all", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await user.selectOptions(screen.getByLabelText("Credits"), "Director");
    await user.selectOptions(screen.getByLabelText("Credits"), "All");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter writer titles", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await user.selectOptions(screen.getByLabelText("Credits"), "Writer");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter writer titles then show all", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await user.selectOptions(screen.getByLabelText("Credits"), "Writer");
    await user.selectOptions(screen.getByLabelText("Credits"), "All");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter performer titles", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await user.selectOptions(screen.getByLabelText("Credits"), "Performer");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter performer titles then show all", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await user.selectOptions(screen.getByLabelText("Credits"), "Performer");
    await userEvent.selectOptions(screen.getByLabelText("Credits"), "All");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can clear all filters", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply multiple filters
    await fillTextFilter(user, "Title", "Smokey");

    await userEvent.selectOptions(screen.getByLabelText("Credits"), "Writer");

    await clickViewResults(user);

    // Open filter drawer again
    await clickToggleFilters(user);

    // Clear all filters
    await clickClearFilters(user);

    // Check that filters are cleared
    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Credits")).toHaveValue("All");

    await clickViewResults(user);

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can reset filters when closing drawer", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply initial filter
    await fillTextFilter(user, "Title", "Smokey");

    // Apply the filters
    await clickViewResults(user);

    // Store the count of filtered results
    const filteredList = screen.getByTestId("grouped-poster-list");
    const filteredCount =
      within(filteredList).queryAllByRole("listitem").length;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Start typing a new filter but don't apply
    await fillTextFilter(user, "Title", "Different");

    // Close the drawer with the X button (should reset pending changes)
    await clickCloseFilters(user);

    // The list should still show the originally filtered results
    const listAfterReset = screen.getByTestId("grouped-poster-list");
    const resetCount = within(listAfterReset).queryAllByRole("listitem").length;
    expect(resetCount).toBe(filteredCount);

    // Open filter drawer again to verify filters were reset to last applied state
    await clickToggleFilters(user);

    // Should show the originally applied filter, not the pending change
    expect(screen.getByLabelText("Title")).toHaveValue("Smokey");
  });
});
