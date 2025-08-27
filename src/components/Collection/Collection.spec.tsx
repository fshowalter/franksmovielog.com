import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { DRAWER_CLOSE_ANIMATION_MS } from "~/components/ListWithFilters";
import { TEXT_FILTER_DEBOUNCE_MS } from "~/components/TextFilter";

import { Collection } from "./Collection";
import { getProps } from "./getProps";

const props = await getProps("shaw-brothers");

describe("Collection", () => {
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
    const { asFragment } = render(<Collection {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("can filter by title", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<Collection {...props} />);

    // Open filter drawer
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Type the filter text
    await user.type(screen.getByLabelText("Title"), "Dracula");
    act(() => {
      vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
    });

    // Apply the filter
    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    // List updates synchronously with fake timers

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by title A → Z", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (A → Z)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by title Z → A", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (Z → A)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by release date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Oldest First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by release date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Newest First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by grade with best first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Best First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Worst First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by review date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Date (Oldest First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by review date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Date (Newest First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by release year", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    const fieldset = screen.getByRole("group", { name: "Release Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1970");
    await userEvent.selectOptions(toInput, "1980");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // List updates synchronously with fake timers

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by review year", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    const fieldset = screen.getByRole("group", { name: "Review Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2021");
    await userEvent.selectOptions(toInput, "2022");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // List updates synchronously with fake timers

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter reviewed titles", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Reviewed Status"),
      "Reviewed",
    );

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can show unreviewed titles", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Reviewed Status"),
      "Not Reviewed",
    );

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can show all titles", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collection {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Reviewed Status"),
      "Not Reviewed",
    );

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    await userEvent.selectOptions(
      screen.getByLabelText("Reviewed Status"),
      "All",
    );

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can show more titles", async ({ expect }) => {
    expect.hasAssertions();
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
    render(<Collection {...propsWithManyValues} />);
    await userEvent.click(screen.getByText("Show More"));
    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can clear all filters", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<Collection {...props} />);

    // Open filter drawer
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Apply filter
    await user.type(screen.getByLabelText("Title"), "Five");
    act(() => {
      vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
    });

    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    // Open filter drawer again
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Clear all filters
    await user.click(screen.getByRole("button", { name: "Clear all filters" }));

    // Check that filters are cleared
    expect(screen.getByLabelText("Title")).toHaveValue("");

    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can reset filters when closing drawer", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<Collection {...props} />);

    // Open filter drawer
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Apply initial filter
    await user.type(screen.getByLabelText("Title"), "Five");
    act(() => {
      vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
    });

    // Apply the filters
    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    // Store the count of filtered results
    const filteredList = screen.getByTestId("grouped-poster-list");
    const filteredCount =
      within(filteredList).queryAllByRole("listitem").length;

    // Open filter drawer again
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Start typing a new filter but don't apply
    await user.clear(screen.getByLabelText("Title"));
    await user.type(screen.getByLabelText("Title"), "Different");
    act(() => {
      vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
    });

    // Close the drawer with the X button (should reset pending changes)
    await user.click(screen.getByRole("button", { name: "Close filters" }));

    // Wait for drawer close animation
    act(() => {
      vi.advanceTimersByTime(DRAWER_CLOSE_ANIMATION_MS);
    });

    // The list should still show the originally filtered results
    const listAfterReset = screen.getByTestId("grouped-poster-list");
    const resetCount = within(listAfterReset).queryAllByRole("listitem").length;
    expect(resetCount).toBe(filteredCount);

    // Open filter drawer again to verify filters were reset to last applied state
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Should show the originally applied filter, not the pending change
    expect(screen.getByLabelText("Title")).toHaveValue("Five");
  });
});
