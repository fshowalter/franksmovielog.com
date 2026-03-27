import type { ComponentProps } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SortProps } from "./FilterAndSortContainer";

import { FilterAndSortToolbar } from "./FilterAndSortToolbar";

describe("FilterAndSortToolbar", () => {
  let mockOnFilterClick: ComponentProps<
    typeof FilterAndSortToolbar
  >["onFilterClick"];
  let mockOnSortChange: ComponentProps<
    typeof FilterAndSortToolbar
  >["sortProps"]["onSortChange"];
  let toggleButtonRef: React.RefObject<HTMLButtonElement | null>;

  const defaultSortProps: SortProps<string> = {
    currentSortValue: "title",
    onSortChange: vi.fn(),
    sortOptions: [
      { label: "Title", value: "title" },
      { label: "Year", value: "year" },
      { label: "Grade", value: "grade" },
    ],
  };

  beforeEach(() => {
    mockOnFilterClick = vi.fn();
    mockOnSortChange = vi.fn();
    toggleButtonRef = createRef();
  });

  describe("Result Count", () => {
    it("displays total count with formatting", () => {
      render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={1234}
        />,
      );

      expect(screen.getByText("1,234")).toBeInTheDocument();
      expect(screen.getByText("Results")).toBeInTheDocument();
    });

    it("handles zero count", () => {
      render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={0}
        />,
      );

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("handles single result", () => {
      render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={1}
        />,
      );

      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("formats large numbers with commas", () => {
      render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={123_456}
        />,
      );

      expect(screen.getByText("123,456")).toBeInTheDocument();
    });
  });

  describe("Header Link", () => {
    it("renders header link when provided", () => {
      render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          headerLink={{ href: "/watchlist", text: "View Watchlist" }}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={100}
        />,
      );

      const link = screen.getByRole("link", { name: "View Watchlist" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/watchlist");
    });

    it("does not render link when not provided", () => {
      render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={100}
        />,
      );

      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });

  describe("Sort Dropdown", () => {
    it("renders sort dropdown with current value", () => {
      render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          onFilterClick={mockOnFilterClick}
          sortProps={{
            ...defaultSortProps,
            currentSortValue: "year",
          }}
          toggleButtonRef={toggleButtonRef}
          totalCount={100}
        />,
      );

      const select = screen.getByLabelText("Sort");
      expect(select).toHaveValue("year");
    });

    it("renders all sort options", () => {
      render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={100}
        />,
      );

      expect(screen.getByRole("option", { name: "Title" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Year" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Grade" })).toBeInTheDocument();
    });

    it("calls onSortChange when selection changes", async () => {
      const user = userEvent.setup();
      const customSortProps = {
        ...defaultSortProps,
        onSortChange: mockOnSortChange,
      };

      render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          onFilterClick={mockOnFilterClick}
          sortProps={customSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={100}
        />,
      );

      const select = screen.getByLabelText("Sort");
      await user.selectOptions(select, "year");

      expect(mockOnSortChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Filter Toggle Button", () => {
    it("renders toggle button with correct label", () => {
      render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={100}
        />,
      );

      const button = screen.getByRole("button", { name: "Toggle filters" });
      expect(button).toBeInTheDocument();
    });

    it("calls onFilterClick when button is clicked", async () => {
      const user = userEvent.setup();

      render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={100}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Toggle filters" }));

      expect(mockOnFilterClick).toHaveBeenCalledTimes(1);
    });

    it("sets aria-expanded to false when drawer is closed", () => {
      render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={100}
        />,
      );

      const button = screen.getByRole("button", { name: "Toggle filters" });
      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("sets aria-expanded to true when drawer is open", () => {
      render(
        <FilterAndSortToolbar
          filterDrawerVisible={true}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={100}
        />,
      );

      const button = screen.getByRole("button", { name: "Toggle filters" });
      expect(button).toHaveAttribute("aria-expanded", "true");
    });

    it("has aria-controls pointing to filters", () => {
      render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={100}
        />,
      );

      const button = screen.getByRole("button", { name: "Toggle filters" });
      expect(button).toHaveAttribute("aria-controls", "filters");
    });

    it("attaches ref to toggle button", () => {
      render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={100}
        />,
      );

      expect(toggleButtonRef.current).toBeInstanceOf(HTMLButtonElement);
      expect(toggleButtonRef.current?.getAttribute("aria-label")).toBe(
        "Toggle filters",
      );
    });
  });

  describe("Responsive Text", () => {
    it("renders both mobile and desktop text for filter button", () => {
      render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={100}
        />,
      );

      // Check for both text variations (they exist in DOM, hidden by CSS)
      const button = screen.getByRole("button", { name: "Toggle filters" });
      expect(button.textContent).toContain("Filter & Sort");
      expect(button.textContent).toContain("Filter");
    });
  });

  describe("Snapshot Tests", () => {
    it("matches snapshot - basic render", () => {
      const { container } = render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={100}
        />,
      );

      expect(container).toMatchSnapshot();
    });

    it("matches snapshot - with header link", () => {
      const { container } = render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          headerLink={{ href: "/watchlist", text: "View Watchlist" }}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={100}
        />,
      );

      expect(container).toMatchSnapshot();
    });

    it("matches snapshot - drawer visible", () => {
      const { container } = render(
        <FilterAndSortToolbar
          filterDrawerVisible={true}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={100}
        />,
      );

      expect(container).toMatchSnapshot();
    });

    it("matches snapshot - zero results", () => {
      const { container } = render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={0}
        />,
      );

      expect(container).toMatchSnapshot();
    });

    it("matches snapshot - large result count", () => {
      const { container } = render(
        <FilterAndSortToolbar
          filterDrawerVisible={false}
          onFilterClick={mockOnFilterClick}
          sortProps={defaultSortProps}
          toggleButtonRef={toggleButtonRef}
          totalCount={123_456}
        />,
      );

      expect(container).toMatchSnapshot();
    });
  });
});
