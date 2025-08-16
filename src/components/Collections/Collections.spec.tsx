import { act, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { TEXT_FILTER_DEBOUNCE_MS } from "~/components/TextFilter";

import { Collections } from "./Collections";
import { getProps } from "./getProps";

const props = await getProps();

describe("Collections", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("can filter by name", async ({ expect }) => {
    expect.hasAssertions();

    // Setup userEvent with advanceTimers
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
    });

    render(<Collections {...props} />);

    // Get initial list content for comparison
    const initialList = screen.getByTestId("list").textContent;

    // Open filter drawer
    await user.click(screen.getByRole("button", { name: "Toggle filters" }));

    // Type the filter text
    await user.type(screen.getByLabelText("Name"), "Friday the 13th");
    act(() => {
      vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
    });

    // Apply the filter
    await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));

    // Wait for the list to update (filters to be applied)
    await waitFor(() => {
      const currentList = screen.getByTestId("list").textContent;
      expect(currentList).not.toBe(initialList);
    });

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by name desc", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collections {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Name (Z → A)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by name asc", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collections {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Name (A → Z)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by title count desc", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collections {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title Count (Most First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by title count asc", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collections {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Title Count (Fewest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by review count desc", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collections {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Count (Most First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });

  it("can sort by review count asc", async ({ expect }) => {
    expect.hasAssertions();

    render(<Collections {...props} />);

    await userEvent.selectOptions(
      screen.getByLabelText("Sort"),
      "Review Count (Fewest First)",
    );

    expect(screen.getByTestId("list")).toMatchSnapshot();
  });
});
