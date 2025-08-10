import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, it, vi } from "vitest";

import { ListWithFilters } from "./ListWithFilters";

// Mock scrollIntoView for all tests
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

// Mock getComputedStyle to return breakpoint value
const originalGetComputedStyle = globalThis.getComputedStyle;
globalThis.getComputedStyle = (element: Element) => {
  const styles = originalGetComputedStyle(element);
  return {
    ...styles,
    getPropertyValue: (prop: string) => {
      if (prop === "--breakpoint-tablet-landscape") {
        return "1024";
      }
      return styles.getPropertyValue(prop);
    },
  };
};

// Test props for ListWithFilters
const mockProps = {
  backdrop: <div data-testid="backdrop">Test Backdrop</div>,
  filters: (
    <div data-testid="filters-content">
      <input placeholder="Filter input" type="text" />
      <button type="button">Filter button</button>
    </div>
  ),
  list: <div data-testid="list">Test List Content</div>,
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

describe("ListWithFilters", () => {
  it("renders", ({ expect }) => {
    const { asFragment } = render(<ListWithFilters {...mockProps} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("displays the correct total count", ({ expect }) => {
    expect.hasAssertions();

    render(<ListWithFilters {...mockProps} totalCount={250} />);

    expect(screen.getByText("250")).toBeInTheDocument();
    expect(screen.getByText("Results")).toBeInTheDocument();
  });

  it("can sort items", async ({ expect }) => {
    expect.hasAssertions();

    const onSortChange = vi.fn();
    const props = {
      ...mockProps,
      sortProps: {
        ...mockProps.sortProps,
        onSortChange,
      },
    };

    render(<ListWithFilters {...props} />);

    const sortSelect = screen.getByLabelText("Sort");

    await userEvent.selectOptions(sortSelect, "title-desc");

    expect(onSortChange).toHaveBeenCalled();
  });

  it("renders optional list header buttons", ({ expect }) => {
    expect.hasAssertions();

    const listHeaderButtons = (
      <button data-testid="header-button" type="button">
        Custom Header Button
      </button>
    );

    render(
      <ListWithFilters {...mockProps} listHeaderButtons={listHeaderButtons} />,
    );

    expect(screen.getByTestId("header-button")).toBeInTheDocument();
  });

  it("renders optional sub navigation", ({ expect }) => {
    expect.hasAssertions();

    const dynamicSubNav = <nav data-testid="sub-nav">Sub Navigation</nav>;

    render(<ListWithFilters {...mockProps} dynamicSubNav={dynamicSubNav} />);

    expect(screen.getByTestId("sub-nav")).toBeInTheDocument();
  });

  it("applies custom className", ({ expect }) => {
    expect.hasAssertions();

    const { container } = render(
      <ListWithFilters {...mockProps} className="transform-3d" />,
    );

    const layoutElement = container.querySelector(".transform-3d");
    expect(layoutElement).toBeTruthy();
  });

  describe("when on mobile", () => {
    beforeEach(() => {
      // Mock mobile viewport
      Object.defineProperty(globalThis, "innerWidth", {
        configurable: true,
        value: 375,
      });
    });

    afterEach(() => {
      // Clean up body classes
      document.body.classList.remove("overflow-hidden");
    });

    it("opens and closes filter drawer", async ({ expect }) => {
      expect.hasAssertions();

      render(<ListWithFilters {...mockProps} />);

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
      expect(filterButton.getAttribute("aria-expanded")).toBe("false");
      expect(document.body.classList.contains("overflow-hidden")).toBe(false);
    });

    it("closes filter drawer with escape key", async ({ expect }) => {
      expect.hasAssertions();

      render(<ListWithFilters {...mockProps} />);

      const filterButton = screen.getByRole("button", {
        name: "Toggle filters",
      });

      // Open drawer
      await userEvent.click(filterButton);
      expect(filterButton.getAttribute("aria-expanded")).toBe("true");

      // Press escape
      await userEvent.keyboard("{Escape}");
      expect(filterButton.getAttribute("aria-expanded")).toBe("false");
      expect(document.body.classList.contains("overflow-hidden")).toBe(false);
    });

    it("closes filter drawer when clicking outside (on backdrop)", async ({
      expect,
    }) => {
      expect.hasAssertions();

      const { container } = render(<ListWithFilters {...mockProps} />);
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

      // Drawer should be closed
      expect(filterButton.getAttribute("aria-expanded")).toBe("false");
      expect(document.body.classList.contains("overflow-hidden")).toBe(false);
    });

    it("closes filter drawer with View Results button", async ({ expect }) => {
      expect.hasAssertions();

      render(<ListWithFilters {...mockProps} />);

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

      expect(filterButton.getAttribute("aria-expanded")).toBe("false");
      expect(document.body.classList.contains("overflow-hidden")).toBe(false);
    });

    it("handles focus management when opening drawer", async ({ expect }) => {
      expect.hasAssertions();

      // Mock requestAnimationFrame
      const rafSpy = vi
        .spyOn(globalThis, "requestAnimationFrame")
        .mockImplementation((cb) => {
          cb(0);
          return 0;
        });

      render(<ListWithFilters {...mockProps} />);

      const filterButton = screen.getByRole("button", {
        name: "Toggle filters",
      });

      // Open drawer
      await userEvent.click(filterButton);

      // Check that requestAnimationFrame was called for focus management
      expect(rafSpy).toHaveBeenCalled();

      rafSpy.mockRestore();
    });
  });

  describe("when on tablet-landscape", () => {
    beforeEach(() => {
      // Mock desktop viewport
      Object.defineProperty(globalThis, "innerWidth", {
        configurable: true,
        value: 1440,
      });
    });

    it("scrolls to filters instead of opening drawer", async ({ expect }) => {
      expect.hasAssertions();

      // Mock scrollIntoView
      const scrollIntoViewMock = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      render(<ListWithFilters {...mockProps} />);

      const filterButton = screen.getByRole("button", {
        name: "Toggle filters",
      });

      // Click filter button on desktop
      await userEvent.click(filterButton);

      // Should not open drawer
      expect(filterButton.getAttribute("aria-expanded")).toBe("false");
      expect(document.body.classList.contains("overflow-hidden")).toBe(false);

      // Should scroll to filters
      expect(scrollIntoViewMock).toHaveBeenCalled();
    });

    it("handles focus management when clicking filter button", async ({
      expect,
    }) => {
      expect.hasAssertions();

      // Mock setTimeout
      const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");

      render(<ListWithFilters {...mockProps} />);

      const filterButton = screen.getByRole("button", {
        name: "Toggle filters",
      });

      // Click filter button on desktop
      await userEvent.click(filterButton);

      // Check that setTimeout was called for delayed focus
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 500);

      setTimeoutSpy.mockRestore();
    });
  });
});
