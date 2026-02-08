import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { FilterChip } from "./AppliedFilters";

import { AppliedFilters } from "./AppliedFilters";

describe("AppliedFilters", () => {
  let mockOnRemove: ReturnType<typeof vi.fn>;
  let mockOnClearAll: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnRemove = vi.fn();
    mockOnClearAll = vi.fn();
  });

  const sampleFilters: FilterChip[] = [
    { category: "Genre", id: "genre-horror", label: "Horror" },
    { category: "Genre", id: "genre-action", label: "Action" },
    { category: "Search", id: "search", label: "alien" },
  ];

  describe("Visibility", () => {
    it("renders nothing when filters array is empty", () => {
      const { container } = render(
        <AppliedFilters
          filters={[]}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );
      expect(container).toBeEmptyDOMElement();
    });

    it("renders when filters array has items", () => {
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );
      expect(screen.getByText("Applied Filters:")).toBeInTheDocument();
    });
  });

  describe("Filter Chips", () => {
    it("renders a chip for each filter", () => {
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      expect(screen.getByText(/Genre: Horror/)).toBeInTheDocument();
      expect(screen.getByText(/Genre: Action/)).toBeInTheDocument();
      expect(screen.getByText(/Search: alien/)).toBeInTheDocument();
    });

    it("formats chip text with category and label", () => {
      render(
        <AppliedFilters
          filters={[{ category: "Year", id: "year-1980", label: "1980-1989" }]}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      expect(screen.getByText(/Year: 1980-1989/)).toBeInTheDocument();
    });

    it("formats chip text without category when category equals label", () => {
      render(
        <AppliedFilters
          filters={[{ category: "Reviewed", id: "status", label: "Reviewed" }]}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      // Should show "Reviewed" not "Reviewed: Reviewed"
      expect(screen.getByText("Reviewed")).toBeInTheDocument();
      expect(screen.queryByText("Reviewed: Reviewed")).not.toBeInTheDocument();
    });

    it("shows × symbol in each chip", () => {
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      const buttons = screen.getAllByRole("button");
      // 3 chips + 1 "Clear all" button = 4 total
      const chipButtons = buttons.filter((btn) =>
        btn.getAttribute("aria-label")?.startsWith("Remove"),
      );

      expect(chipButtons).toHaveLength(3);
      for (const btn of chipButtons) {
        expect(btn.textContent).toContain("×");
      }
    });
  });

  describe("Chip Removal", () => {
    it("calls onRemove with correct id when chip × is clicked", async () => {
      const user = userEvent.setup();
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      const horrorChip = screen.getByLabelText("Remove Genre: Horror filter");
      await user.click(horrorChip);

      expect(mockOnRemove).toHaveBeenCalledTimes(1);
      expect(mockOnRemove).toHaveBeenCalledWith("genre-horror");
    });

    it("calls onRemove with different ids for different chips", async () => {
      const user = userEvent.setup();
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      const actionChip = screen.getByLabelText("Remove Genre: Action filter");
      await user.click(actionChip);

      expect(mockOnRemove).toHaveBeenCalledWith("genre-action");

      const searchChip = screen.getByLabelText("Remove Search: alien filter");
      await user.click(searchChip);

      expect(mockOnRemove).toHaveBeenCalledWith("search");
      expect(mockOnRemove).toHaveBeenCalledTimes(2);
    });
  });

  describe("Clear All", () => {
    it("renders Clear all link", () => {
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      expect(screen.getByText("Clear all")).toBeInTheDocument();
    });

    it("calls onClearAll when Clear all is clicked", async () => {
      const user = userEvent.setup();
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      const clearAllButton = screen.getByText("Clear all");
      await user.click(clearAllButton);

      expect(mockOnClearAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("Keyboard Navigation", () => {
    it("chip buttons are keyboard accessible", async () => {
      const user = userEvent.setup();
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      const horrorChip = screen.getByLabelText("Remove Genre: Horror filter");

      // Tab to focus, Enter to activate
      horrorChip.focus();
      expect(horrorChip).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(mockOnRemove).toHaveBeenCalledWith("genre-horror");
    });

    it("Clear all button is keyboard accessible", async () => {
      const user = userEvent.setup();
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      const clearAllButton = screen.getByText("Clear all");

      clearAllButton.focus();
      expect(clearAllButton).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(mockOnClearAll).toHaveBeenCalledTimes(1);
    });

    it("supports Space key to activate chip removal", async () => {
      const user = userEvent.setup();
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      const actionChip = screen.getByLabelText("Remove Genre: Action filter");
      actionChip.focus();

      await user.keyboard(" ");
      expect(mockOnRemove).toHaveBeenCalledWith("genre-action");
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels for chip removal buttons", () => {
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      expect(
        screen.getByLabelText("Remove Genre: Horror filter"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Remove Genre: Action filter"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Remove Search: alien filter"),
      ).toBeInTheDocument();
    });

    it('hides × symbol from screen readers with aria-hidden', () => {
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      const horrorChip = screen.getByLabelText("Remove Genre: Horror filter");
      const xSymbol = horrorChip.querySelector('[aria-hidden="true"]');

      expect(xSymbol).toBeInTheDocument();
      expect(xSymbol?.textContent).toBe("×");
    });

    it("chip buttons have type='button' to prevent form submission", () => {
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      const horrorChip = screen.getByLabelText("Remove Genre: Horror filter");
      expect(horrorChip).toHaveAttribute("type", "button");
    });

    it("Clear all button has type='button' to prevent form submission", () => {
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      const clearAllButton = screen.getByText("Clear all");
      expect(clearAllButton).toHaveAttribute("type", "button");
    });
  });

  describe("Visual Rendering", () => {
    it("matches snapshot with multiple filters", () => {
      const { container } = render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("matches snapshot with single filter", () => {
      const { container } = render(
        <AppliedFilters
          filters={[{ category: "Genre", id: "genre-horror", label: "Horror" }]}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("matches snapshot with search filter", () => {
      const { container } = render(
        <AppliedFilters
          filters={[{ category: "Search", id: "search", label: "alien" }]}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
