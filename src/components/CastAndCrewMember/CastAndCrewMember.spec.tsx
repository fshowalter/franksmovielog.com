import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { DRAWER_CLOSE_ANIMATION_MS } from "~/components/ListWithFilters";
import { DROPDOWN_CLOSE_DELAY_MS } from "~/components/MultiSelectField";
import { TEXT_FILTER_DEBOUNCE_MS } from "~/components/TextFilter";

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
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<CastAndCrewMember {...props} />);

    // Open filter drawer
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Type the filter text
    await user.type(screen.getByLabelText("Title"), "Cannonball");
    act(() => {
      vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
    });

    // Apply the filter
    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    // List updates synchronously with fake timers

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by genres", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<CastAndCrewMember {...props} />);

    // Open filter drawer
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    const genresButton = screen.getByLabelText("Genres");

    // Click to open the dropdown
    await user.click(genresButton);

    // Select Action
    const actionOption = await screen.findByRole("option", { name: "Action" });
    await user.click(actionOption);

    // Advance timers for dropdown to close
    act(() => {
      vi.advanceTimersByTime(DROPDOWN_CLOSE_DELAY_MS);
    });

    // Click to open the dropdown again
    await user.click(genresButton);

    // Select Comedy
    const comedyOption = await screen.findByRole("option", { name: "Comedy" });
    await user.click(comedyOption);

    // Advance timers for dropdown to close again
    act(() => {
      vi.advanceTimersByTime(DROPDOWN_CLOSE_DELAY_MS);
    });

    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by title A → Z", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (A → Z)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by title Z → A", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title (Z → A)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by release date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Oldest First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by release date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Release Date (Newest First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by grade with best first", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Best First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by grade with worst first", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Grade (Worst First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by review date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Date (Oldest First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can sort by review date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Date (Newest First)",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can filter by release year", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

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

    render(<CastAndCrewMember {...props} />);

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

  it("can hide reviewed titles", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.click(screen.getByText("Hide Reviewed"));

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can show hidden reviewed titles", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.click(screen.getByText("Hide Reviewed"));
    await userEvent.click(screen.getByText("Show Reviewed"));

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can show director titles", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Credits"), "Director");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can show director titles then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Credits"), "Director");
    await userEvent.selectOptions(screen.getByLabelText("Credits"), "All");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can show writer titles", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Credits"), "Writer");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can show writer titles then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(screen.getByLabelText("Credits"), "Writer");
    await userEvent.selectOptions(screen.getByLabelText("Credits"), "All");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can show performer titles", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Credits"),
      "Performer",
    );

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can show performer titles then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<CastAndCrewMember {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Credits"),
      "Performer",
    );
    await userEvent.selectOptions(screen.getByLabelText("Credits"), "All");

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can clear all filters", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<CastAndCrewMember {...props} />);

    // Open filter drawer
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Apply multiple filters
    await user.type(screen.getByLabelText("Title"), "Smokey");
    act(() => {
      vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
    });

    await userEvent.selectOptions(screen.getByLabelText("Credits"), "Writer");

    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    // Open filter drawer again
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Clear all filters
    await user.click(screen.getByRole("button", { name: "Clear all filters" }));

    // Check that filters are cleared
    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Credits")).toHaveValue("All");

    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    expect(screen.getByTestId("grouped-poster-list")).toMatchSnapshot();
  });

  it("can reset filters when closing drawer", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<CastAndCrewMember {...props} />);

    // Open filter drawer
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Apply initial filter
    await user.type(screen.getByLabelText("Title"), "Smokey");
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
    expect(screen.getByLabelText("Title")).toHaveValue("Smokey");
  });
});
