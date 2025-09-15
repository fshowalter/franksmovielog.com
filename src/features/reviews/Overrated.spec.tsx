import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/filter-and-sort/FilterAndSortContainer.testHelper";
import {
  clickGenresFilterOption,
  fillReleaseYearFilter,
  fillTitleFilter,
  getTitleFilter,
} from "~/components/filter-and-sort/ReviewedTitleFilters.testHelper";
import {
  clickShowMore,
  getGroupedPosterList,
} from "~/components/poster-list/PosterList.testHelper";
import { getUserWithFakeTimers } from "~/components/utils/testUtils";

import { getOverratedProps } from "./getProps";
import { OverratedStrictWrapper } from "./Overrated";

const props = await getOverratedProps();

describe("Overrated", () => {
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

  it("can filter by title", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<OverratedStrictWrapper props={props} />);

    await clickToggleFilters(user);

    // Type the filter text
    await fillTitleFilter(user, "Bad Seed");

    await clickViewResults(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can show more titles", async ({ expect }) => {
    expect.hasAssertions();

    // Create props with more than 100 items to trigger pagination
    const manyValues = Array.from({ length: 150 }, (_, i) => ({
      genres: ["Drama"],
      grade: "B+" as const,
      gradeValue: 8,
      imdbId: `tt${String(i).padStart(7, "0")}`,
      posterImageProps: {
        src: "test.jpg",
        srcSet: "test.jpg 1x",
      },
      releaseSequence: i + 1,
      releaseYear: "1930",
      reviewDisplayDate: "Jan 01, 2023",
      reviewSequence: i + 1,
      reviewYear: "2023",
      slug: `test-movie-${i + 1}`,
      sortTitle: `Test Movie ${String(i + 1).padStart(3, "0")}`,
      title: `Test Movie ${i + 1}`,
    }));
    const propsWithManyValues = {
      ...props,
      values: manyValues,
    };

    const user = getUserWithFakeTimers();

    render(<OverratedStrictWrapper props={propsWithManyValues} />);

    await clickShowMore(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by title (A → Z)", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<OverratedStrictWrapper props={props} />);

    await clickSortOption(user, "Title (A → Z)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by title (Z → A)", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<OverratedStrictWrapper props={props} />);

    await clickSortOption(user, "Title (Z → A)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by release date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<OverratedStrictWrapper props={props} />);

    await clickSortOption(user, "Release Date (Oldest First)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by release date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<OverratedStrictWrapper props={props} />);

    await clickSortOption(user, "Release Date (Newest First)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by grade with best first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<OverratedStrictWrapper props={props} />);

    await clickSortOption(user, "Grade (Best First)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<OverratedStrictWrapper props={props} />);

    await clickSortOption(user, "Grade (Worst First)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by release year", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<OverratedStrictWrapper props={props} />);

    await clickToggleFilters(user);

    await fillReleaseYearFilter(user, "1982", "2021");

    await clickViewResults(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by release year reversed", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<OverratedStrictWrapper props={props} />);

    await clickToggleFilters(user);

    await fillReleaseYearFilter(user, "1982", "2018");

    await clickViewResults(user);

    await clickToggleFilters(user);

    await fillReleaseYearFilter(user, "2021", "1982");

    await clickViewResults(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by genres", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<OverratedStrictWrapper props={props} />);

    await clickToggleFilters(user);

    await clickGenresFilterOption(user, "Horror");
    await clickGenresFilterOption(user, "Comedy");

    // Apply the filter
    await clickViewResults(user);

    // List updates synchronously with fake timers
    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can clear all filters", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<OverratedStrictWrapper props={props} />);

    const listBeforeFilters = getGroupedPosterList().innerHTML;

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply multiple filters
    await fillTitleFilter(user, "Test");

    await clickGenresFilterOption(user, "Horror");

    await clickViewResults(user);

    // Open filter drawer
    await clickToggleFilters(user);

    // Clear all filters
    await clickClearFilters(user);

    // The clear button doesn't immediately update the UI, we need to check the View Results count
    await clickViewResults(user);

    const listAfterClear = getGroupedPosterList().innerHTML;

    expect(listBeforeFilters).toEqual(listAfterClear);
  });

  it("can reset filters when closing drawer", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<OverratedStrictWrapper props={props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply initial filter
    await fillTitleFilter(user, "Bad Seed");

    // Apply the filters
    await clickViewResults(user);

    // Store the count of filtered results
    const listBeforeReset = getGroupedPosterList().innerHTML;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Start typing a new filter but don't apply
    await fillTitleFilter(user, "Completely Different");

    // Close the drawer with the X button (should reset pending changes)
    await clickCloseFilters(user);

    // The list should still show the originally filtered results
    const listAfterReset = getGroupedPosterList().innerHTML;

    expect(listBeforeReset).toEqual(listAfterReset);

    // Open filter drawer again to verify filters were reset to last applied state
    await clickToggleFilters(user);

    // Should show the originally applied filter, not the pending change
    expect(getTitleFilter()).toHaveValue("Bad Seed");
  });
});
