import type { ComponentProps } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppliedFilters } from "./AppliedFilters";

type AppliedFiltersProps = ComponentProps<typeof AppliedFilters>;

describe("AppliedFilters", () => {
  let mockOnRemove: AppliedFiltersProps["onRemove"];
  let mockOnClearAll: AppliedFiltersProps["onClearAll"];

  beforeEach(() => {
    mockOnRemove = vi.fn();
    mockOnClearAll = vi.fn();
  });

  const sampleFilters: AppliedFiltersProps["filters"] = [
    { displayText: "Horror", key: "genre-horror", value: "Horror" },
    { displayText: "Action", key: "genre-action", value: "Action" },
    { displayText: "Search: alien", key: "title" },
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
      expect(screen.getByText("Applied Filters")).toBeInTheDocument();
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

      expect(screen.getByText("Horror")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
      expect(screen.getByText("Search: alien")).toBeInTheDocument();
    });

    it("renders pre-assembled displayText for range filters", () => {
      render(
        <AppliedFilters
          filters={[
            { displayText: "Release Year: 1980 to 1989", key: "releaseYear" },
          ]}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      expect(
        screen.getByText("Release Year: 1980 to 1989"),
      ).toBeInTheDocument();
    });

    it("renders pre-assembled displayText for simple filters (value only)", () => {
      render(
        <AppliedFilters
          filters={[
            { displayText: "Horror", key: "genre-horror", value: "Horror" },
          ]}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      expect(screen.getByText("Horror")).toBeInTheDocument();
      expect(screen.queryByText("Genre: Horror")).not.toBeInTheDocument();
    });

    it("renders pre-assembled displayText for grade filters", () => {
      render(
        <AppliedFilters
          filters={[{ displayText: "Grade: A- to B+", key: "gradeValue" }]}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      expect(screen.getByText("Grade: A- to B+")).toBeInTheDocument();
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
    it("calls onRemove with correct key when chip × is clicked", async () => {
      const user = userEvent.setup();
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      const horrorChip = screen.getByLabelText("Remove Horror filter");
      await user.click(horrorChip);

      expect(mockOnRemove).toHaveBeenCalledTimes(1);
      expect(mockOnRemove).toHaveBeenCalledWith("genre-horror");
    });

    it("calls onRemove with different keys for different chips", async () => {
      const user = userEvent.setup();
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      const actionChip = screen.getByLabelText("Remove Action filter");
      await user.click(actionChip);

      expect(mockOnRemove).toHaveBeenCalledWith("genre-action");

      const searchChip = screen.getByLabelText("Remove Search: alien filter");
      await user.click(searchChip);

      expect(mockOnRemove).toHaveBeenCalledWith("title");
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

      const horrorChip = screen.getByLabelText("Remove Horror filter");

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

      const actionChip = screen.getByLabelText("Remove Action filter");
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

      expect(screen.getByLabelText("Remove Horror filter")).toBeInTheDocument();
      expect(screen.getByLabelText("Remove Action filter")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Remove Search: alien filter"),
      ).toBeInTheDocument();
    });

    it("hides × symbol from screen readers with aria-hidden", () => {
      render(
        <AppliedFilters
          filters={sampleFilters}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );

      const horrorChip = screen.getByLabelText("Remove Horror filter");
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

      const horrorChip = screen.getByLabelText("Remove Horror filter");
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
          filters={[
            { displayText: "Horror", key: "genre-horror", value: "Horror" },
          ]}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it("matches snapshot with search filter", () => {
      const { container } = render(
        <AppliedFilters
          filters={[{ displayText: "Search: alien", key: "title" }]}
          onClearAll={mockOnClearAll}
          onRemove={mockOnRemove}
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
