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

import { getProps } from "./getProps";
import { Watchlist } from "./Watchlist";
import {
  clickCollectionFilterOption,
  clickDirectorFilterOption,
  clickPerformerFilterOption,
  clickWriterFilterOption,
  getDirectorFilter,
  getPerformerFilter,
} from "./Watchlist.testHelper";

const props = await getProps();

describe("/watchlist", () => {
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

    render(<Watchlist {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Type the filter text
    await fillTitleFilter(user, "Lawyer Man");

    await clickViewResults(user);

    // List updates synchronously with fake timers
    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by not-found title", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Type the filter text
    await fillTitleFilter(user, "Non-existent movie");

    await clickViewResults(user);

    // List updates synchronously with fake timers
    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by director", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await clickDirectorFilterOption(user, "Howard Hawks");

    await clickViewResults(user);

    // List updates synchronously with fake timers

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by director then show all", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await clickDirectorFilterOption(user, "Howard Hawks");

    await clickViewResults(user);

    // Open filter drawer again
    await clickToggleFilters(user);

    await clickDirectorFilterOption(user, "All");

    await clickViewResults(user);

    // List updates synchronously with fake timers

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by performer", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await clickPerformerFilterOption(user, "John Wayne");

    await clickViewResults(user);

    // List updates synchronously with fake timers

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by performer then show all", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await clickPerformerFilterOption(user, "John Wayne");

    await clickViewResults(user);

    await clickToggleFilters(user);

    await clickPerformerFilterOption(user, "All");

    await clickViewResults(user);

    // List updates synchronously with fake timers

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by writer", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await clickWriterFilterOption(user, "Leigh Brackett");

    await clickViewResults(user);

    // List updates synchronously with fake timers

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by writer then show all", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await clickWriterFilterOption(user, "Leigh Brackett");

    await clickViewResults(user);

    await clickToggleFilters(user);

    await clickWriterFilterOption(user, "All");

    await clickViewResults(user);

    // List updates synchronously with fake timers

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by collection", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await clickCollectionFilterOption(user, "Universal Monsters");

    await clickViewResults(user);

    // List updates synchronously with fake timers

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by collection then show all", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await clickCollectionFilterOption(user, "Universal Monsters");

    await clickViewResults(user);

    await clickToggleFilters(user);

    await clickCollectionFilterOption(user, "All");

    await clickViewResults(user);

    // List updates synchronously with fake timers

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by genres", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await clickGenreFilterOption(user, "Horror");
    await clickGenreFilterOption(user, "Thriller");

    await clickViewResults(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by title A → Z", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Watchlist {...props} />);

    await clickSortOption(user, "Title (A → Z)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by title Z → A", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Watchlist {...props} />);

    await clickSortOption(user, "Title (Z → A)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by release date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Watchlist {...props} />);

    await clickSortOption(user, "Release Date (Oldest First)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can sort by release date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Watchlist {...props} />);

    await clickSortOption(user, "Release Date (Newest First)");

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can filter by release year", async ({ expect }) => {
    expect.hasAssertions();

    const user = getUserWithFakeTimers();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    await fillReleaseYearFilter(user, "1930", "1935");

    await clickViewResults(user);

    // List updates synchronously with fake timers
    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can show more titles", async ({ expect }) => {
    expect.hasAssertions();

    // Create props with more than 100 items to trigger pagination
    const manyValues = Array.from({ length: 150 }, (_, i) => ({
      genres: [],
      imdbId: `tt${String(i).padStart(7, "0")}`,
      releaseSequence: i + 1,
      releaseYear: "1930",
      sortTitle: `Test Movie ${String(i + 1).padStart(3, "0")}`,
      title: `Test Movie ${i + 1}`,
      viewed: false,
      watchlistCollectionNames: [],
      watchlistDirectorNames: [],
      watchlistPerformerNames: [],
      watchlistWriterNames: [],
    }));

    const propsWithManyValues = {
      ...props,
      values: manyValues,
    };

    const user = getUserWithFakeTimers();

    render(<Watchlist {...propsWithManyValues} />);

    await clickShowMore(user);

    expect(getGroupedPosterList()).toMatchSnapshot();
  });

  it("can clear all filters", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply multiple filters
    await fillTitleFilter(user, "No result");

    await clickDirectorFilterOption(user, "Howard Hawks");

    await clickPerformerFilterOption(user, "John Wayne");

    await clickViewResults(user);

    const listBeforeClear = getGroupedPosterList().innerHTML;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Clear all filters
    await clickClearFilters(user);

    // Check that filters are cleared
    expect(getTitleFilter()).toHaveValue("");
    expect(getDirectorFilter()).toHaveValue("All");
    expect(getPerformerFilter()).toHaveValue("All");

    await clickViewResults(user);

    const listAfterClear = getGroupedPosterList().innerHTML;

    expect(listBeforeClear).not.toEqual(listAfterClear);
  });

  it("can reset filters when closing drawer", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = getUserWithFakeTimers();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await clickToggleFilters(user);

    // Apply filters
    await fillTitleFilter(user, "red line");

    await clickDirectorFilterOption(user, "Howard Hawks");

    // Apply the filters
    await clickViewResults(user);

    const listBeforeReset = getGroupedPosterList().innerHTML;

    // Open filter drawer again
    await clickToggleFilters(user);

    // Start typing a new filter but don't apply
    await fillTitleFilter(user, "Another Test");

    // Close the drawer with the X button (should reset pending changes)
    await clickCloseFilters(user);

    const listAfterReset = getGroupedPosterList().innerHTML;

    expect(listAfterReset).toEqual(listBeforeReset);

    // Open filter drawer again to verify filters were reset to last applied state
    await clickToggleFilters(user);

    // Should show the originally applied filter, not the pending change
    expect(getTitleFilter()).toHaveValue("red line");
    expect(getDirectorFilter()).toHaveValue("Howard Hawks");
  });
});
