import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { DRAWER_CLOSE_ANIMATION_MS } from "~/components/ListWithFilters/ListWithFilters";
import { DROPDOWN_CLOSE_DELAY_MS } from "~/components/MultiSelectField";
import { TEXT_FILTER_DEBOUNCE_MS } from "~/components/TextField";

import { getProps } from "./getProps";
import { Watchlist } from "./Watchlist";

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

  it("renders", ({ expect }) => {
    const { asFragment } = render(<Watchlist {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("can filter by title", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<Watchlist {...props} />);

    // Open filter drawer
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Type the filter text
    await user.type(screen.getByLabelText("Title"), "Lawyer Man");
    act(() => {
      vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
    });

    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    // List updates synchronously with fake timers

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by not-found title", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<Watchlist {...props} />);

    // Open filter drawer
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Type the filter text
    await user.type(screen.getByLabelText("Title"), "This movie doesn't exist");
    act(() => {
      vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
    });

    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    // List updates synchronously with fake timers

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by director", async ({ expect }) => {
    expect.hasAssertions();
    render(<Watchlist {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(
      screen.getByLabelText("Director"),
      "Howard Hawks",
    );

    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // List updates synchronously with fake timers

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by director then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(
      screen.getByLabelText("Director"),
      "Howard Hawks",
    );

    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Open filter drawer again
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(screen.getByLabelText("Director"), "All");

    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // List updates synchronously with fake timers

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by performer", async ({ expect }) => {
    expect.hasAssertions();
    render(<Watchlist {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(
      screen.getByLabelText("Performer"),
      "Bette Davis",
    );

    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // List updates synchronously with fake timers

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by performer then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(
      screen.getByLabelText("Performer"),
      "Bette Davis",
    );

    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Open filter drawer again
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(screen.getByLabelText("Performer"), "All");

    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // List updates synchronously with fake timers

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by writer", async ({ expect }) => {
    expect.hasAssertions();
    render(<Watchlist {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(
      screen.getByLabelText("Writer"),
      "Leigh Brackett",
    );

    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // List updates synchronously with fake timers

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by writer then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(
      screen.getByLabelText("Writer"),
      "Leigh Brackett",
    );

    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Open filter drawer again
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(screen.getByLabelText("Writer"), "All");

    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // List updates synchronously with fake timers

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by collection", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(
      screen.getByLabelText("Collection"),
      "Universal Monsters",
    );

    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // List updates synchronously with fake timers

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by collection then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(
      screen.getByLabelText("Collection"),
      "Universal Monsters",
    );

    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Open filter drawer again
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(screen.getByLabelText("Collection"), "All");

    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // List updates synchronously with fake timers

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by genres", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<Watchlist {...props} />);

    // Open filter drawer
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    const genresButton = screen.getByLabelText("Genres");

    // Click to open the dropdown
    await user.click(genresButton);

    // Select Horror
    const horrorOption = await screen.findByRole("option", { name: "Horror" });
    await user.click(horrorOption);

    // Advance timers for dropdown to close
    act(() => {
      vi.advanceTimersByTime(DROPDOWN_CLOSE_DELAY_MS);
    });

    // Click to open the dropdown again
    await user.click(genresButton);

    // Select Thriller
    const thrillerOption = await screen.findByRole("option", {
      name: "Thriller",
    });
    await user.click(thrillerOption);

    // Advance timers for dropdown to close again
    act(() => {
      vi.advanceTimersByTime(DROPDOWN_CLOSE_DELAY_MS);
    });

    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by title A → Z", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (A → Z)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by title Z → A", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (Z → A)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by release date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Oldest First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by release date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Newest First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by release year", async ({ expect }) => {
    expect.hasAssertions();

    render(<Watchlist {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    const fieldset = screen.getByRole("group", { name: "Release Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1930");
    await userEvent.selectOptions(toInput, "1935");

    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // List updates synchronously with fake timers

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can show more titles", async ({ expect }) => {
    expect.hasAssertions();

    // Create props with more than 100 items to trigger pagination
    const manyValues = Array.from({ length: 150 }, (_, i) => ({
      genres: [],
      imdbId: `tt${String(i).padStart(7, "0")}`,
      releaseSequence: `1930-01-${String(i + 1).padStart(2, "0")}tt${String(i).padStart(7, "0")}`,
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

    render(<Watchlist {...propsWithManyValues} />);

    await userEvent.click(screen.getByText("Show More"));

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can clear all filters", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<Watchlist {...props} />);

    // Open filter drawer
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Apply multiple filters
    await user.type(screen.getByLabelText("Title"), "Test");
    act(() => {
      vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
    });

    await userEvent.selectOptions(
      screen.getByLabelText("Director"),
      "Howard Hawks",
    );

    await userEvent.selectOptions(
      screen.getByLabelText("Performer"),
      "Bette Davis",
    );

    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    // Open filter drawer again
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Clear all filters
    await user.click(screen.getByRole("button", { name: "Clear all filters" }));

    // Check that filters are cleared
    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Director")).toHaveValue("All");
    expect(screen.getByLabelText("Performer")).toHaveValue("All");

    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can reset filters when closing drawer", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<Watchlist {...props} />);

    // Open filter drawer
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Apply filters
    await user.type(screen.getByLabelText("Title"), "Test");
    act(() => {
      vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
    });

    await userEvent.selectOptions(
      screen.getByLabelText("Director"),
      "Howard Hawks",
    );

    // Apply the filters
    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    // Open filter drawer again
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Start typing a new filter but don't apply
    await user.clear(screen.getByLabelText("Title"));
    await user.type(screen.getByLabelText("Title"), "Another Test");
    act(() => {
      vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
    });

    // Close the drawer with the X button (should reset pending changes)
    await user.click(screen.getByRole("button", { name: "Close filters" }));

    // Wait for drawer close animation - onResetFilters is called after animation
    act(() => {
      vi.advanceTimersByTime(DRAWER_CLOSE_ANIMATION_MS);
    });

    // Open filter drawer again to verify filters were reset to last applied state
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Should show the originally applied filter, not the pending change
    expect(screen.getByLabelText("Title")).toHaveValue("Test");
    expect(screen.getByLabelText("Director")).toHaveValue("Howard Hawks");
  });
});
