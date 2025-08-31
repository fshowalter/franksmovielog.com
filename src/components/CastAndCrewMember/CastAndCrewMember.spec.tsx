import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import {
  clickCreditedAsFilterOption,
  getCreditedAsFilter,
} from "~/components/CreditedAsFilter.testHelper";
import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/ListWithFilters/ListWithFilters.testHelper";
import {
  clickShowMore,
  getGroupedPosterList,
} from "~/components/PosterList.testHelper";
import { clickReviewedStatusFilterOption } from "~/components/ReviewedStatusFilter.testHelper";
import {
  clickGenreFilterOption,
  fillGradeFilter,
  fillReleaseYearFilter,
  fillReviewYearFilter,
  fillTitleFilter,
  getTitleFilter,
} from "~/components/TitleFilters.testHelper";
import { getUserWithFakeTimers } from "~/components/utils/testUtils";

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
    await fillTitleFilter(user, "Cannonball");

    // Apply the filter
    await clickViewResults(user);

    // List updates synchronously with fake timers
    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by genres", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await clickGenreFilterOption(user, "Action");

    // Click to open the dropdown again
    await clickGenreFilterOption(user, "Comedy");

    await clickViewResults(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by title A → Z", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickSortOption(user, "Title (A → Z)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by title Z → A", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickSortOption(user, "Title (Z → A)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by release date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickSortOption(user, "Release Date (Oldest First)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by release date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickSortOption(user, "Release Date (Newest First)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by grade with best first", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickSortOption(user, "Grade (Best First)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickSortOption(user, "Grade (Worst First)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by review date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickSortOption(user, "Review Date (Oldest First)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by review date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickSortOption(user, "Review Date (Newest First)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by release year", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await fillReleaseYearFilter(user, "1970", "1980");

    // Apply the filter
    await clickViewResults(user);

    // List updates synchronously with fake timers
    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by review year", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await fillReviewYearFilter(user, "2021", "2022");

    // Apply the filter
    await clickViewResults(user);

    // List updates synchronously with fake timers
    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter reviewed titles", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickToggleFilters(user);

    await clickReviewedStatusFilterOption(user, "Reviewed");

    // Apply the filter
    await clickViewResults(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter unreviewed titles", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickReviewedStatusFilterOption(user, "Not Reviewed");

    // Apply the filter
    await clickViewResults(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter all reviewed status titles", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickReviewedStatusFilterOption(user, "Not Reviewed");

    // Apply the filter
    await clickViewResults(user);

    await clickReviewedStatusFilterOption(user, "All");

    // Apply the filter
    await clickViewResults(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter director titles", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickToggleFilters(user);

    await clickCreditedAsFilterOption(user, "Director");

    await clickViewResults(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter director titles then show all", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickToggleFilters(user);

    await clickCreditedAsFilterOption(user, "Director");

    await clickViewResults(user);

    await clickToggleFilters(user);

    await clickCreditedAsFilterOption(user, "All");

    await clickViewResults(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter writer titles", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickToggleFilters(user);

    await clickCreditedAsFilterOption(user, "Writer");

    await clickViewResults(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter writer titles then show all", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickToggleFilters(user);

    await clickCreditedAsFilterOption(user, "Writer");

    await clickViewResults(user);

    await clickToggleFilters(user);

    await clickCreditedAsFilterOption(user, "All");

    await clickViewResults(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter performer titles", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickToggleFilters(user);

    await clickCreditedAsFilterOption(user, "Performer");

    await clickViewResults(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter performer titles then show all", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickToggleFilters(user);

    await clickCreditedAsFilterOption(user, "Performer");

    await clickViewResults(user);

    await clickToggleFilters(user);

    await clickCreditedAsFilterOption(user, "All");

    await clickViewResults(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can clear all filters", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply multiple filters
    await fillTitleFilter(user, "Smokey");

    await clickCreditedAsFilterOption(user, "Writer");

    await clickViewResults(user);

    const listBeforeClear = getGroupedPosterList().innerHTML;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Clear all filters
    await clickClearFilters(user);

    // Check that filters are cleared
    expect(getTitleFilter()).toHaveValue("");
    expect(getCreditedAsFilter()).toHaveValue("All");

    await clickViewResults(user);

    const listAfterClear = getGroupedPosterList().innerHTML;

    expect(listBeforeClear).not.toEqual(listAfterClear);
  });

  it("can filter by grade reversed", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickToggleFilters(user);

    await fillGradeFilter(user, "B", "B+");
    await fillGradeFilter(user, "A-", "B-");

    await clickViewResults(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by grade", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    await clickToggleFilters(user);

    await fillGradeFilter(user, "B", "B+");

    await clickViewResults(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can reset filters when closing drawer", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<CastAndCrewMember {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply initial filter
    await fillTitleFilter(user, "Smokey");

    // Apply the filters
    await clickViewResults(user);

    // Store the count of filtered results
    const listBeforeReset = getGroupedPosterList().innerHTML;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Start typing a new filter but don't apply
    await fillTitleFilter(user, "Different");

    // Close the drawer with the X button (should reset pending changes)
    await clickCloseFilters(user);

    // The list should still show the originally filtered results
    const listAfterReset = getGroupedPosterList().innerHTML;
    expect(listBeforeReset).toEqual(listAfterReset);

    // Open filter drawer again to verify filters were reset to last applied state
    await clickToggleFilters(user);

    // Should show the originally applied filter, not the pending change
    expect(getTitleFilter()).toHaveValue("Smokey");
  });

  it("can show more titles", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    // Create props with more than 100 items to trigger pagination
    const manyValues = Array.from({ length: 150 }, (_, i) => ({
      grade: i % 2 === 0 ? "B+" : undefined,
      gradeValue: i % 2 === 0 ? 8 : undefined,
      imdbId: `tt${String(i).padStart(7, "0")}`,
      posterImageProps: undefined,
      releaseSequence: `1970-01-${String(i + 1).padStart(2, "0")}tt${String(i).padStart(7, "0")}`,
      releaseYear: "1970",
      reviewed: i % 2 === 0,
      slug: `test-movie-${i + 1}`,
      sortTitle: `Test Movie ${String(i + 1).padStart(3, "0")}`,
      title: `Test Movie ${i + 1}`,
    }));
    const propsWithManyValues = {
      ...props,
      values: manyValues,
    };

    render(<CastAndCrewMember {...propsWithManyValues} />);

    await clickShowMore(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });
});
