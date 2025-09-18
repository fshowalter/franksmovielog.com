import { act, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, it, vi } from "vitest";

import { FilterAndSortContainer } from "./FilterAndSortContainer";

// Mock scrollIntoView for all tests
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

// Test props for FilterAndSortContainer
const mockProps = {
  backdrop: <div data-testid="backdrop">Test Backdrop</div>,
  filters: (
    <div data-testid="filters-content">
      <input placeholder="Filter input" type="text" />
      <button type="button">Filter button</button>
    </div>
  ),
  hasPendingFilters: false,
  list: <div data-testid="list">Test List Content</div>,
  onApplyFilters: vi.fn(),
  onClearFilters: vi.fn(),
  onFilterDrawerOpen: vi.fn(),
  onResetFilters: vi.fn(),
  pendingFilteredCount: 250,
  sortProps: {
    currentSortValue: "title-asc",
    onSortChange: vi.fn(),
    sortOptions: (
      <>
        <option value="title-asc">Title (A → Z)</option>
        <option value="title-desc">Title (Z → A)</option>
      </>
    ),
  },
  totalCount: 100,
};

describe("FilterAndSortContainer", () => {
  it("renders", ({ expect }) => {
    const { asFragment } = render(
      <FilterAndSortContainer {...mockProps}>Test</FilterAndSortContainer>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("displays the correct total count", ({ expect }) => {
    expect.hasAssertions();

    render(
      <FilterAndSortContainer {...mockProps} totalCount={250}>
        Test
      </FilterAndSortContainer>,
    );

    expect(screen.getByText("250")).toBeInTheDocument();
    expect(screen.getByText("Results")).toBeInTheDocument();
  });

  describe("filter drawer", () => {
    afterEach(() => {
      // Clean up body classes
      document.body.classList.remove("overflow-hidden");
    });

    it("opens and closes filter drawer", async ({ expect }) => {
      expect.hasAssertions();

      render(
        <FilterAndSortContainer {...mockProps}>Test</FilterAndSortContainer>,
      );

      const filterButton = screen.getByRole("button", {
        name: "Toggle filters",
      });
      const filterDrawer = screen.getByLabelText("Filters");

      // Initially closed
      expect(filterButton.getAttribute("aria-expanded")).toBe("false");
      expect(filterDrawer).toMatchSnapshot();

      // Open drawer
      await userEvent.click(filterButton);
      expect(filterButton.getAttribute("aria-expanded")).toBe("true");
      expect(document.body.classList.contains("overflow-hidden")).toBe(true);
      expect(filterDrawer).toMatchSnapshot();

      // Close drawer
      await userEvent.click(filterButton);
      // Wait for animation to complete
      await waitFor(
        () => {
          expect(filterButton.getAttribute("aria-expanded")).toBe("false");
          expect(document.body.classList.contains("overflow-hidden")).toBe(
            false,
          );
        },
        { timeout: 300 },
      );
    });

    it("closes filter drawer with escape key", async ({ expect }) => {
      expect.hasAssertions();

      render(
        <FilterAndSortContainer {...mockProps}>Test</FilterAndSortContainer>,
      );

      const filterButton = screen.getByRole("button", {
        name: "Toggle filters",
      });

      // Open drawer
      await userEvent.click(filterButton);
      expect(filterButton.getAttribute("aria-expanded")).toBe("true");

      // Press escape
      await userEvent.keyboard("{Escape}");
      // Wait for animation to complete
      await waitFor(
        () => {
          expect(filterButton.getAttribute("aria-expanded")).toBe("false");
          expect(document.body.classList.contains("overflow-hidden")).toBe(
            false,
          );
        },
        { timeout: 300 },
      );
    });

    it("closes filter drawer when clicking outside (on backdrop)", async ({
      expect,
    }) => {
      expect.hasAssertions();

      const { container } = render(
        <FilterAndSortContainer {...mockProps}>Test</FilterAndSortContainer>,
      );
      const filterButton = screen.getByRole("button", {
        name: "Toggle filters",
      });

      // Open drawer
      await userEvent.click(filterButton);
      expect(filterButton.getAttribute("aria-expanded")).toBe("true");
      expect(document.body.classList.contains("overflow-hidden")).toBe(true);

      // Find the backdrop element and click it
      const backdrop = container.querySelector(
        '[aria-hidden="true"].fixed.inset-0',
      );
      expect(backdrop).toBeTruthy();

      if (backdrop) {
        // Simulate clicking the backdrop
        act(() => {
          // Create and dispatch a native click event
          const clickEvent = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
          });
          backdrop.dispatchEvent(clickEvent);
        });
      }

      // Drawer should be closed - wait for animation
      await waitFor(
        () => {
          expect(filterButton.getAttribute("aria-expanded")).toBe("false");
          expect(document.body.classList.contains("overflow-hidden")).toBe(
            false,
          );
        },
        { timeout: 300 },
      );
    });

    it("closes filter drawer with View Results button", async ({ expect }) => {
      expect.hasAssertions();

      render(
        <FilterAndSortContainer {...mockProps}>Test</FilterAndSortContainer>,
      );

      const filterButton = screen.getByRole("button", {
        name: "Toggle filters",
      });

      // Open drawer
      await userEvent.click(filterButton);
      expect(filterButton.getAttribute("aria-expanded")).toBe("true");

      // Click View Results
      const viewResultsButton = screen.getByRole("button", {
        name: /View \d+ Results/,
      });
      await userEvent.click(viewResultsButton);

      // Wait for animation to complete
      await waitFor(
        () => {
          expect(filterButton.getAttribute("aria-expanded")).toBe("false");
          expect(document.body.classList.contains("overflow-hidden")).toBe(
            false,
          );
        },
        { timeout: 300 },
      );
    });
  });
});
