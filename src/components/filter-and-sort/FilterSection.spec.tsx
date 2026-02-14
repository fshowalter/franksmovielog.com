import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { FilterSection } from "./FilterSection";

describe("FilterSection", () => {
  it("renders open by default (matching Orbit DVD pattern)", () => {
    render(
      <FilterSection title="Test Section">
        <div>Content</div>
      </FilterSection>,
    );

    const details = screen.getByRole("group");
    expect(details).toHaveAttribute("open");
  });

  it("renders closed when defaultOpen is false", () => {
    render(
      <FilterSection defaultOpen={false} title="Test Section">
        <div>Content</div>
      </FilterSection>,
    );

    const details = screen.getByRole("group");
    expect(details).not.toHaveAttribute("open");
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

    // Initially open (default state)
    expect(details).toHaveAttribute("open");

    // Click to close
    await user.click(summary);
    expect(details).not.toHaveAttribute("open");

    // Click to open again
    await user.click(summary);
    expect(details).toHaveAttribute("open");
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

  it("applies transition classes to content wrapper", () => {
    const { container } = render(
      <FilterSection title="Test Section">
        <div>Content</div>
      </FilterSection>,
    );

    // Verify transition classes for smooth animation
    const contentWrapper = container.querySelector(".transform-gpu");
    expect(contentWrapper).toBeInTheDocument();
    expect(contentWrapper).toHaveClass("overflow-hidden");
    expect(contentWrapper).toHaveClass("transition-[height,opacity]");
    expect(contentWrapper).toHaveClass("duration-200");
    expect(contentWrapper).toHaveClass("ease-in-out");
  });

  it("sets initial height and opacity for open state", () => {
    const { container } = render(
      <FilterSection defaultOpen={true} title="Test Section">
        <div>Content</div>
      </FilterSection>,
    );

    const contentWrapper = container.querySelector(
      ".transform-gpu",
    ) as HTMLElement;
    expect(contentWrapper).toBeInTheDocument();
    expect(contentWrapper?.style.height).toBe("auto");
    expect(contentWrapper?.style.opacity).toBe("1");
  });

  it("sets initial height and opacity for closed state", () => {
    const { container } = render(
      <FilterSection defaultOpen={false} title="Test Section">
        <div>Content</div>
      </FilterSection>,
    );

    const contentWrapper = container.querySelector(
      ".transform-gpu",
    ) as HTMLElement;
    expect(contentWrapper).toBeInTheDocument();
    expect(contentWrapper?.style.height).toBe("0px");
    expect(contentWrapper?.style.opacity).toBe("0");
  });

  // AIDEV-NOTE: Animation behavior (toggle transitions, height changes) cannot be tested
  // in jsdom as it doesn't support CSS transitions or the TransitionEvent API.
  // These animations must be verified through manual browser testing.

  it("snapshot test - open state (default)", () => {
    const { container } = render(
      <FilterSection title="Genres">
        <div>Filter content here</div>
      </FilterSection>,
    );

    expect(container).toMatchSnapshot();
  });

  it("snapshot test - closed state", () => {
    const { container } = render(
      <FilterSection defaultOpen={false} title="Genres">
        <div>Filter content here</div>
      </FilterSection>,
    );

    expect(container).toMatchSnapshot();
  });
});
