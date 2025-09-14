import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import {
  clickClearFilters,
  clickCloseFilters,
  clickSortOption,
  clickToggleFilters,
  clickViewResults,
} from "~/components/ListWithFilters/ListWithFilters.testHelper";
import {
  clickGenreFilterOption,
  fillReleaseYearFilter,
  fillTitleFilter,
  getTitleFilter,
} from "~/components/ListWithFilters/TitleFilters.testHelper";
import {
  clickShowMore,
  getGroupedPosterList,
} from "~/components/PosterList.testHelper";
import { getUserWithFakeTimers } from "~/components/utils/testUtils";

import { getUnderseenProps } from "./getProps";
import { type UnderseenProps, UnderseenStrictWrapper } from "./Underseen";

const props = await getUnderseenProps();

describe("Underseen", () => {
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
    const { asFragment } = render(<UnderseenStrictWrapper props={props} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("can filter by title", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<UnderseenStrictWrapper props={props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Type the filter text
    await fillTitleFilter(user, "Boxer");

    await clickViewResults(user);

    // Check that the list has been filtered
    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can show more titles", async ({ expect }) => {
    expect.hasAssertions();
    // Create props with more than 100 items to trigger pagination
    const manyValues: UnderseenProps["values"] = Array.from(
      { length: 150 },
      (_, i) => ({
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
      }),
    );
    const propsWithManyValues = {
      ...props,
      values: manyValues,
    };

    const user = getUserWithFakeTimers();

    render(<UnderseenStrictWrapper props={propsWithManyValues} />);

    await clickShowMore(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by title (A → Z)", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<UnderseenStrictWrapper props={props} />);

    await clickSortOption(user, "Title (A → Z)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by title (Z → A)", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<UnderseenStrictWrapper props={props} />);

    await clickSortOption(user, "Title (Z → A)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by release date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<UnderseenStrictWrapper props={props} />);

    await clickSortOption(user, "Release Date (Oldest First)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by release date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<UnderseenStrictWrapper props={props} />);

    await clickSortOption(user, "Release Date (Newest First)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by grade with best first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<UnderseenStrictWrapper props={props} />);

    await clickSortOption(user, "Grade (Best First)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<UnderseenStrictWrapper props={props} />);

    await clickSortOption(user, "Grade (Worst First)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by review date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<UnderseenStrictWrapper props={props} />);

    await clickSortOption(user, "Review Date (Oldest First)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by review date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<UnderseenStrictWrapper props={props} />);

    await clickSortOption(user, "Review Date (Newest First)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by release year", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<UnderseenStrictWrapper props={props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await fillReleaseYearFilter(user, "1983", "1987");

    // Apply the filter
    await clickViewResults(user);

    // List updates synchronously with fake timers
    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by release year reversed", async ({ expect }) => {
    const user = getUserWithFakeTimers();

    render(<UnderseenStrictWrapper props={props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await fillReleaseYearFilter(user, "1983", "1987");

    // Apply the filter
    await clickViewResults(user);

    await clickToggleFilters(user);

    await fillReleaseYearFilter(user, "1989", "1986");

    // Apply the filter
    await clickViewResults(user);

    // Apply the filter
    await clickViewResults(user);

    // List updates synchronously with fake timers
    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by genres", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<UnderseenStrictWrapper props={props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await clickGenreFilterOption(user, "Horror");
    await clickGenreFilterOption(user, "Action");

    // Apply the filter
    await clickViewResults(user);

    // List updates synchronously with fake timers
    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can clear all filters", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<UnderseenStrictWrapper props={props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply multiple filters
    await fillTitleFilter(user, "Beyond");
    await clickGenreFilterOption(user, "Horror");

    await clickViewResults(user);

    const listBeforeClear = getGroupedPosterList().innerHTML;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Clear all filters
    await clickClearFilters(user);

    // Check that filters are cleared
    expect(getTitleFilter()).toHaveValue("");

    await clickViewResults(user);

    const listAfterClear = getGroupedPosterList().innerHTML;

    expect(listBeforeClear).not.toEqual(listAfterClear);
  });

  it("can reset filters when closing drawer", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<UnderseenStrictWrapper props={props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply initial filter
    await fillTitleFilter(user, "Boxer");

    // Apply the filters
    await clickViewResults(user);

    // Store the count of filtered results
    const listBeforeReset = getGroupedPosterList().innerHTML;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Start typing a new filter but don't apply
    await fillTitleFilter(user, "Different Movie");

    // Close the drawer with the X button (should reset pending changes)
    await clickCloseFilters(user);

    const listAfterReset = getGroupedPosterList().innerHTML;

    expect(listBeforeReset).toEqual(listAfterReset);

    // Open filter drawer again to verify filters were reset to last applied state
    await clickToggleFilters(user);

    // Should show the originally applied filter, not the pending change
    expect(getTitleFilter()).toHaveValue("Boxer");
  });
});
