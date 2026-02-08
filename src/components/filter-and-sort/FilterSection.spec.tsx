import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { FilterSection } from "./FilterSection";

describe("FilterSection", () => {
  it("renders closed by default", () => {
    render(
      <FilterSection title="Test Section">
        <div>Content</div>
      </FilterSection>,
    );

    const details = screen.getByRole("group");
    expect(details).not.toHaveAttribute("open");
  });

  it("renders open when defaultOpen is true", () => {
    render(
      <FilterSection defaultOpen={true} title="Test Section">
        <div>Content</div>
      </FilterSection>,
    );

    const details = screen.getByRole("group");
    expect(details).toHaveAttribute("open");
  });

  it("displays the section title", () => {
    render(
      <FilterSection title="Genres">
        <div>Content</div>
      </FilterSection>,
    );

    expect(screen.getByText("Genres")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <FilterSection title="Test Section">
        <div>Test Content</div>
      </FilterSection>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("toggles open/closed when summary is clicked", async () => {
    const user = userEvent.setup();

    render(
      <FilterSection title="Test Section">
        <div>Content</div>
      </FilterSection>,
    );

    const details = screen.getByRole("group");
    const summary = screen.getByText("Test Section");

    // Initially closed
    expect(details).not.toHaveAttribute("open");

    // Click to open
    await user.click(summary);
    expect(details).toHaveAttribute("open");

    // Click to close
    await user.click(summary);
    expect(details).not.toHaveAttribute("open");
  });

  it("does not show selection count (removed per spec)", () => {
    // AIDEV-NOTE: Spec compliance - "(n selected)" feature was removed from spec
    render(
      <FilterSection title="Genres">
        <div>Content</div>
      </FilterSection>,
    );

    expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
  });

  it("uses native details/summary for keyboard accessibility", () => {
    const { container } = render(
      <FilterSection title="Test Section">
        <div>Content</div>
      </FilterSection>,
    );

    // Verify we're using native details/summary elements
    // These provide built-in keyboard navigation (Enter/Space to toggle)
    const details = container.querySelector("details");
    const summary = container.querySelector("summary");

    expect(details).toBeInTheDocument();
    expect(summary).toBeInTheDocument();
    expect(summary?.parentElement).toBe(details);

    // Note: Native details/summary keyboard behavior (Enter/Space) is handled
    // by the browser and doesn't need explicit testing in jsdom
  });

  it("has accessible summary element", () => {
    render(
      <FilterSection title="Test Section">
        <div>Content</div>
      </FilterSection>,
    );

    // summary element should be properly structured
    const summary = screen.getByText("Test Section").closest("summary");
    expect(summary).toBeInTheDocument();
    expect(summary?.tagName).toBe("SUMMARY");
  });

  it("applies correct styling classes", () => {
    const { container } = render(
      <FilterSection title="Test Section">
        <div>Content</div>
      </FilterSection>,
    );

    const details = container.querySelector("details");
    expect(details).toHaveClass("border-b", "border-default", "last:border-0");

    const summary = container.querySelector("summary");
    expect(summary).toHaveClass(
      "flex",
      "cursor-pointer",
      "items-center",
      "justify-between",
      "px-4",
      "py-3",
    );
  });

  it("renders disclosure triangle", () => {
    const { container } = render(
      <FilterSection title="Test Section">
        <div>Content</div>
      </FilterSection>,
    );

    // Check for SVG disclosure triangle
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("snapshot test - closed state with no selections", () => {
    const { container } = render(
      <FilterSection title="Genres">
        <div>Filter content here</div>
      </FilterSection>,
    );

    expect(container).toMatchSnapshot();
  });

  it("snapshot test - open state", () => {
    const { container } = render(
      <FilterSection defaultOpen={true} title="Genres">
        <div>Filter content here</div>
      </FilterSection>,
    );

    expect(container).toMatchSnapshot();
  });
});
