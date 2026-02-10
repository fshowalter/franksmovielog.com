import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { RadioListFieldOption } from "./RadioListField";

import { RadioListField } from "./RadioListField";

const mockOptions: RadioListFieldOption[] = [
  { count: 100, label: "All", value: "all" },
  { count: 75, label: "Reviewed", value: "reviewed" },
  { count: 25, label: "Not Reviewed", value: "not-reviewed" },
];

describe("RadioListField", () => {
  it("renders all options", () => {
    render(
      <RadioListField
        label="Reviewed Status"
        onChange={vi.fn()}
        options={mockOptions}
      />,
    );

    // Check all options are rendered by looking for their radio buttons
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(radios[0]).toHaveAttribute("value", "all");
    expect(radios[1]).toHaveAttribute("value", "reviewed");
    expect(radios[2]).toHaveAttribute("value", "not-reviewed");
  });

  it("displays counts for each option", () => {
    render(
      <RadioListField
        label="Reviewed Status"
        onChange={vi.fn()}
        options={mockOptions}
      />,
    );

    expect(screen.getByText("(100)")).toBeInTheDocument();
    expect(screen.getByText("(75)")).toBeInTheDocument();
    expect(screen.getByText("(25)")).toBeInTheDocument();
  });

  it("selects default value on initial render", () => {
    render(
      <RadioListField
        defaultValue="all"
        label="Reviewed Status"
        onChange={vi.fn()}
        options={mockOptions}
      />,
    );

    const allRadio = screen.getByRole("radio", { name: /All/ });
    expect(allRadio).toBeChecked();
  });

  it("only allows one option to be selected at a time", async () => {
    const user = userEvent.setup();
    render(
      <RadioListField
        defaultValue="all"
        label="Reviewed Status"
        onChange={vi.fn()}
        options={mockOptions}
      />,
    );

    const allRadio = screen.getByRole("radio", { name: /All/ });
    const reviewedRadio = screen.getByRole("radio", { name: /^Reviewed/ });

    expect(allRadio).toBeChecked();
    expect(reviewedRadio).not.toBeChecked();

    await user.click(reviewedRadio);

    expect(allRadio).not.toBeChecked();
    expect(reviewedRadio).toBeChecked();
  });

  it("calls onChange with selected value", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioListField
        defaultValue="all"
        label="Reviewed Status"
        onChange={handleChange}
        options={mockOptions}
      />,
    );

    const reviewedRadio = screen.getByRole("radio", { name: /^Reviewed/ });
    await user.click(reviewedRadio);

    expect(handleChange).toHaveBeenCalledWith("reviewed");
  });

  it("selects option on Space key press", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioListField
        defaultValue="all"
        label="Reviewed Status"
        onChange={handleChange}
        options={mockOptions}
      />,
    );

    const reviewedRadio = screen.getByRole("radio", { name: /^Reviewed/ });
    reviewedRadio.focus();
    await user.keyboard(" ");

    expect(handleChange).toHaveBeenCalledWith("reviewed");
    expect(reviewedRadio).toBeChecked();
  });

  it("selects option on Enter key press", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioListField
        defaultValue="all"
        label="Reviewed Status"
        onChange={handleChange}
        options={mockOptions}
      />,
    );

    const reviewedRadio = screen.getByRole("radio", { name: /^Reviewed/ });
    reviewedRadio.focus();
    await user.keyboard("{Enter}");

    expect(handleChange).toHaveBeenCalledWith("reviewed");
    expect(reviewedRadio).toBeChecked();
  });

  it("does not show Clear link when default value is selected", () => {
    render(
      <RadioListField
        defaultValue="all"
        label="Reviewed Status"
        onChange={vi.fn()}
        options={mockOptions}
      />,
    );

    expect(
      screen.queryByRole("button", { name: /Clear/i }),
    ).not.toBeInTheDocument();
  });

  it("shows Clear link when non-default value is selected", async () => {
    const user = userEvent.setup();

    render(
      <RadioListField
        defaultValue="all"
        label="Reviewed Status"
        onChange={vi.fn()}
        options={mockOptions}
      />,
    );

    const reviewedRadio = screen.getByRole("radio", { name: /^Reviewed/ });
    await user.click(reviewedRadio);

    expect(screen.getByRole("button", { name: /Clear/i })).toBeInTheDocument();
  });

  it("does not show Clear link when no default value and empty selection", () => {
    render(
      <RadioListField
        label="Reviewed Status"
        onChange={vi.fn()}
        options={mockOptions}
      />,
    );

    expect(
      screen.queryByRole("button", { name: /Clear/i }),
    ).not.toBeInTheDocument();
  });

  it("resets to default value when Clear is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioListField
        defaultValue="all"
        label="Reviewed Status"
        onChange={handleChange}
        options={mockOptions}
      />,
    );

    // Select non-default option
    const reviewedRadio = screen.getByRole("radio", { name: /^Reviewed/ });
    await user.click(reviewedRadio);
    expect(reviewedRadio).toBeChecked();

    // Click Clear
    const clearButton = screen.getByRole("button", { name: /Clear/i });
    await user.click(clearButton);

    // Should reset to default
    const allRadio = screen.getByRole("radio", { name: /All/ });
    expect(allRadio).toBeChecked();
    expect(reviewedRadio).not.toBeChecked();
    expect(handleChange).toHaveBeenLastCalledWith("all");
  });

  it("calls onClear callback when Clear is clicked", async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();

    render(
      <RadioListField
        defaultValue="all"
        label="Reviewed Status"
        onChange={vi.fn()}
        onClear={handleClear}
        options={mockOptions}
      />,
    );

    // Select non-default option
    const reviewedRadio = screen.getByRole("radio", { name: /^Reviewed/ });
    await user.click(reviewedRadio);

    // Click Clear
    const clearButton = screen.getByRole("button", { name: /Clear/i });
    await user.click(clearButton);

    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it("resets to default value on form reset", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <form data-testid="test-form">
        <RadioListField
          defaultValue="all"
          label="Reviewed Status"
          onChange={handleChange}
          options={mockOptions}
        />
        <button type="reset">Reset</button>
      </form>,
    );

    // Select non-default option
    const reviewedRadio = screen.getByRole("radio", { name: /^Reviewed/ });
    await user.click(reviewedRadio);
    expect(reviewedRadio).toBeChecked();

    // Reset form
    const resetButton = screen.getByRole("button", { name: /Reset/i });
    await user.click(resetButton);

    // Should reset to default
    const allRadio = screen.getByRole("radio", { name: /All/ });
    expect(allRadio).toBeChecked();
    expect(reviewedRadio).not.toBeChecked();
  });

  it("resets to empty string when no default value on form reset", async () => {
    const user = userEvent.setup();

    render(
      <form data-testid="test-form">
        <RadioListField
          label="Reviewed Status"
          onChange={vi.fn()}
          options={mockOptions}
        />
        <button type="reset">Reset</button>
      </form>,
    );

    // Select an option
    const reviewedRadio = screen.getByRole("radio", { name: /^Reviewed/ });
    await user.click(reviewedRadio);
    expect(reviewedRadio).toBeChecked();

    // Reset form
    const resetButton = screen.getByRole("button", { name: /Reset/i });
    await user.click(resetButton);

    // All should be unchecked
    const radios = screen.getAllByRole("radio");
    for (const radio of radios) {
      expect(radio).not.toBeChecked();
    }
  });

  it("has accessible radiogroup role", () => {
    render(
      <RadioListField
        label="Reviewed Status"
        onChange={vi.fn()}
        options={mockOptions}
      />,
    );

    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });

  it("includes sr-only legend with label text", () => {
    render(
      <RadioListField
        label="Reviewed Status"
        onChange={vi.fn()}
        options={mockOptions}
      />,
    );

    const allRadio = screen.getByRole("radio", { name: /All/ });
    const fieldset = allRadio.closest("fieldset") as HTMLFieldSetElement;
    expect(fieldset).toBeInTheDocument();

    const legend = within(fieldset).getByText("Reviewed Status");
    expect(legend.tagName).toBe("SPAN");
    expect(legend.closest("legend")).toHaveClass("sr-only");
  });

  it("has proper aria-live region for selection changes", () => {
    render(
      <RadioListField
        label="Reviewed Status"
        onChange={vi.fn()}
        options={mockOptions}
      />,
    );

    const radioGroup = screen.getByRole("radiogroup");
    expect(radioGroup).toHaveAttribute("aria-live", "polite");
    expect(radioGroup).toHaveAttribute("aria-relevant", "additions removals");
  });

  it("has unique IDs for each radio button", () => {
    render(
      <RadioListField
        label="Reviewed Status"
        onChange={vi.fn()}
        options={mockOptions}
      />,
    );

    const allRadio = screen.getByRole("radio", { name: /All/ });
    const reviewedRadio = screen.getByRole("radio", { name: /^Reviewed/ });
    const notReviewedRadio = screen.getByRole("radio", {
      name: /Not Reviewed/,
    });

    expect(allRadio.id).toBe("radio-list-reviewed-status-all");
    expect(reviewedRadio.id).toBe("radio-list-reviewed-status-reviewed");
    expect(notReviewedRadio.id).toBe("radio-list-reviewed-status-not-reviewed");
  });

  it("groups radios with same name attribute", () => {
    render(
      <RadioListField
        label="Reviewed Status"
        onChange={vi.fn()}
        options={mockOptions}
      />,
    );

    const radios = screen.getAllByRole("radio");

    for (const radio of radios) {
      expect(radio).toHaveAttribute("name", "radio-list-reviewed-status");
    }
  });

  it("has accessible Clear button label", async () => {
    const user = userEvent.setup();

    render(
      <RadioListField
        defaultValue="all"
        label="Reviewed Status"
        onChange={vi.fn()}
        options={mockOptions}
      />,
    );

    // Select non-default to show Clear button
    const reviewedRadio = screen.getByRole("radio", { name: /^Reviewed/ });
    await user.click(reviewedRadio);

    const clearButton = screen.getByRole("button", {
      name: "Clear Reviewed Status selection",
    });
    expect(clearButton).toBeInTheDocument();
  });

  it("applies hover styles to label on hover", () => {
    render(
      <RadioListField
        label="Reviewed Status"
        onChange={vi.fn()}
        options={mockOptions}
      />,
    );

    const allRadio = screen.getByRole("radio", { name: /All/ });
    const label = allRadio.closest("label");
    expect(label).toHaveClass("hover:bg-stripe");
  });

  it("applies focus styles when radio is focused", () => {
    render(
      <RadioListField
        label="Reviewed Status"
        onChange={vi.fn()}
        options={mockOptions}
      />,
    );

    const allRadio = screen.getByRole("radio", { name: /All/ });
    const label = allRadio.closest("label");
    expect(label).toHaveClass("focus-within:bg-stripe");
  });

  it("matches snapshot with default value", () => {
    const { container } = render(
      <RadioListField
        defaultValue="all"
        label="Reviewed Status"
        onChange={vi.fn()}
        options={mockOptions}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("matches snapshot with non-default value selected (shows Clear)", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <RadioListField
        defaultValue="all"
        label="Reviewed Status"
        onChange={vi.fn()}
        options={[
          { count: 100, label: "All", value: "all" },
          { count: 75, label: "Reviewed", value: "reviewed" },
          { count: 25, label: "Not Reviewed", value: "not-reviewed" },
        ]}
      />,
    );

    // Use userEvent to properly set to non-default value to show Clear button
    const reviewedRadio = screen.getByRole("radio", { name: /^Reviewed/ });
    await user.click(reviewedRadio);

    expect(container.firstChild).toMatchSnapshot();
  });

  it("matches snapshot with no default value", () => {
    const { container } = render(
      <RadioListField
        label="Reviewed Status"
        onChange={vi.fn()}
        options={mockOptions}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
