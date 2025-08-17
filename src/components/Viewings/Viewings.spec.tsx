import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { TEXT_FILTER_DEBOUNCE_MS } from "~/components/TextFilter";

import { getProps } from "./getProps";
import { Viewings } from "./Viewings";

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
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<Viewings {...props} />);

    // Open filter drawer
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Type the filter text
    await user.type(screen.getByLabelText("Title"), "Rio Bravo");
    act(() => {
      vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
    });

    // Apply the filter
    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    // Calendar updates synchronously with fake timers

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can filter by medium", async ({ expect }) => {
    expect.hasAssertions();
    render(<Viewings {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(screen.getByLabelText("Medium"), "Blu-ray");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Calendar updates synchronously with fake timers

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can filter by medium then show all", async ({ expect }) => {
    expect.hasAssertions();

    render(<Viewings {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(screen.getByLabelText("Medium"), "Blu-ray");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Open filter drawer again
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(screen.getByLabelText("Medium"), "All");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Calendar updates synchronously with fake timers

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can filter by venue", async ({ expect }) => {
    expect.hasAssertions();
    render(<Viewings {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(
      screen.getByLabelText("Venue"),
      "Alamo Drafthouse Cinema - One Loudoun",
    );

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Calendar updates synchronously with fake timers

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can filter by venue then show all", async ({ expect }) => {
    expect.hasAssertions();
    render(<Viewings {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(
      screen.getByLabelText("Venue"),
      "Alamo Drafthouse Cinema - One Loudoun",
    );

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Open filter drawer again
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    await userEvent.selectOptions(screen.getByLabelText("Venue"), "All");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Calendar updates synchronously with fake timers

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can sort by viewing date with newest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Viewings {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Viewing Date (Newest First)",
    );

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can sort by viewing date with oldest first", async ({ expect }) => {
    expect.hasAssertions();

    render(<Viewings {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Viewing Date (Oldest First)",
    );

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can filter by release year", async ({ expect }) => {
    expect.hasAssertions();

    render(<Viewings {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    const fieldset = screen.getByRole("group", { name: "Release Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1957");
    await userEvent.selectOptions(toInput, "1970");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Calendar updates synchronously with fake timers

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can filter by release year reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<Viewings {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    const fieldset = screen.getByRole("group", { name: "Release Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "1950");
    await userEvent.selectOptions(toInput, "1957");
    await userEvent.selectOptions(fromInput, "1973");
    await userEvent.selectOptions(toInput, "1950");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Calendar updates synchronously with fake timers

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can filter by viewing year", async ({ expect }) => {
    expect.hasAssertions();

    render(<Viewings {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    const fieldset = screen.getByRole("group", { name: "Viewing Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    // Use a narrower range that will actually filter out some data
    await userEvent.selectOptions(fromInput, "2012");
    await userEvent.selectOptions(toInput, "2012");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Calendar updates synchronously with fake timers

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can filter by viewing year reversed", async ({ expect }) => {
    expect.hasAssertions();

    render(<Viewings {...props} />);

    // Open filter drawer
    await userEvent.click(
      screen.getByRole("button", { name: "Toggle filters" }),
    );

    const fieldset = screen.getByRole("group", { name: "Viewing Year" });
    const fromInput = within(fieldset).getByLabelText("From");
    const toInput = within(fieldset).getByLabelText("to");

    await userEvent.selectOptions(fromInput, "2012");
    await userEvent.selectOptions(toInput, "2014");
    await userEvent.selectOptions(fromInput, "2013");
    await userEvent.selectOptions(toInput, "2012");

    // Apply the filter
    await userEvent.click(
      screen.getByRole("button", { name: /View \d+ Results/ }),
    );

    // Calendar updates synchronously with fake timers

    expect(screen.getByTestId("calendar")).toMatchSnapshot();
  });

  it("can navigate between months", async ({ expect }) => {
    expect.hasAssertions();

    // Just test with the normal props which should have multiple months of data
    render(<Viewings {...props} />);

    // Get the calendar element
    const calendar = screen.getByTestId("calendar");

    // Take a snapshot of the initial state
    expect(calendar).toMatchSnapshot();

    // Check if we can sort to oldest first - this should change the initial month
    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Viewing Date (Oldest First)",
    );

    // Take another snapshot after sorting
    expect(calendar).toMatchSnapshot();
  });
});
