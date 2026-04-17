import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { YearField } from "./YearField";

const mockYears = ["2020", "2021", "2022", "2023", "2024"];

describe("YearField", () => {
  describe("Rendering", () => {
    it("renders field with label", () => {
      render(
        <YearField
          allValues={mockYears}
          label="Release Year"
          onYearChange={vi.fn()}
          selectedValues={undefined}
        />,
      );

      const group = screen.getByRole("group", { name: "Release Year" });
      expect(group).toBeInTheDocument();
    });

    it("renders from and to dropdowns", () => {
      render(
        <YearField
          allValues={mockYears}
          label="Release Year"
          onYearChange={vi.fn()}
          selectedValues={undefined}
        />,
      );

      const fromSelect = screen.getByRole("combobox", { name: /from/i });
      const toSelect = screen.getByRole("combobox", { name: /to/i });

      expect(fromSelect).toBeInTheDocument();
      expect(toSelect).toBeInTheDocument();
    });

    it("renders range slider beneath dropdowns", () => {
      render(
        <YearField
          allValues={mockYears}
          label="Release Year"
          onYearChange={vi.fn()}
          selectedValues={undefined}
        />,
      );

      const fromSlider = screen.getByLabelText("Release Year minimum value");
      const toSlider = screen.getByLabelText("Release Year maximum value");

      expect(fromSlider).toBeInTheDocument();
      expect(toSlider).toBeInTheDocument();
    });

    it("defaults to full range when no selected values", () => {
      render(
        <YearField
          allValues={mockYears}
          label="Release Year"
          onYearChange={vi.fn()}
          selectedValues={undefined}
        />,
      );

      const fromSelect = screen.getByRole<HTMLSelectElement>("combobox", {
        name: /from/i,
      });
      const toSelect = screen.getByRole<HTMLSelectElement>("combobox", {
        name: /to/i,
      });

      expect(fromSelect.value).toBe("2020");
      expect(toSelect.value).toBe("2024");
    });

    it("uses provided selected values", () => {
      render(
        <YearField
          allValues={mockYears}
          label="Release Year"
          onYearChange={vi.fn()}
          selectedValues={["2021", "2023"]}
        />,
      );

      const fromSelect = screen.getByRole<HTMLSelectElement>("combobox", {
        name: /from/i,
      });
      const toSelect = screen.getByRole<HTMLSelectElement>("combobox", {
        name: /to/i,
      });

      expect(fromSelect.value).toBe("2021");
      expect(toSelect.value).toBe("2023");
    });
  });

  describe("Dropdown Interaction", () => {
    it("calls onYearChange when from dropdown changes", async () => {
      const user = userEvent.setup();
      const onYearChange = vi.fn();

      render(
        <YearField
          allValues={mockYears}
          label="Release Year"
          onYearChange={onYearChange}
          selectedValues={undefined}
        />,
      );

      const fromSelect = screen.getByRole("combobox", { name: /from/i });
      await user.selectOptions(fromSelect, "2022");

      expect(onYearChange).toHaveBeenCalledWith(["2022", "2024"]);
    });

    it("calls onYearChange when to dropdown changes", async () => {
      const user = userEvent.setup();
      const onYearChange = vi.fn();

      render(
        <YearField
          allValues={mockYears}
          label="Release Year"
          onYearChange={onYearChange}
          selectedValues={undefined}
        />,
      );

      const toSelect = screen.getByRole("combobox", { name: /to/i });
      await user.selectOptions(toSelect, "2022");

      expect(onYearChange).toHaveBeenCalledWith(["2020", "2022"]);
    });

    it("swaps values when from exceeds to", async () => {
      const user = userEvent.setup();
      const onYearChange = vi.fn();

      render(
        <YearField
          allValues={mockYears}
          label="Release Year"
          onYearChange={onYearChange}
          selectedValues={["2021", "2023"]}
        />,
      );

      const fromSelect = screen.getByRole("combobox", { name: /from/i });
      await user.selectOptions(fromSelect, "2024");

      expect(onYearChange).toHaveBeenCalledWith(["2023", "2024"]);
    });

    it("swaps values when to is less than from", async () => {
      const user = userEvent.setup();
      const onYearChange = vi.fn();

      render(
        <YearField
          allValues={mockYears}
          label="Release Year"
          onYearChange={onYearChange}
          selectedValues={["2021", "2023"]}
        />,
      );

      const toSelect = screen.getByRole("combobox", { name: /to/i });
      await user.selectOptions(toSelect, "2020");

      expect(onYearChange).toHaveBeenCalledWith(["2020", "2021"]);
    });
  });

  describe("Slider Interaction", () => {
    it("calls onYearChange when from slider changes", () => {
      const onYearChange = vi.fn();

      render(
        <YearField
          allValues={mockYears}
          label="Release Year"
          onYearChange={onYearChange}
          selectedValues={undefined}
        />,
      );

      const fromSlider = screen.getByLabelText("Release Year minimum value");

      fireEvent.change(fromSlider, { target: { value: "2022" } });

      expect(onYearChange).toHaveBeenCalledWith(["2022", "2024"]);
    });

    it("calls onYearChange when to slider changes", () => {
      const onYearChange = vi.fn();

      render(
        <YearField
          allValues={mockYears}
          label="Release Year"
          onYearChange={onYearChange}
          selectedValues={undefined}
        />,
      );

      const toSlider = screen.getByLabelText("Release Year maximum value");

      fireEvent.change(toSlider, { target: { value: "2022" } });

      expect(onYearChange).toHaveBeenCalledWith(["2020", "2022"]);
    });
  });

  describe("Clear Functionality", () => {
    it("does not show clear button when at full range", () => {
      render(
        <YearField
          allValues={mockYears}
          label="Release Year"
          onYearChange={vi.fn()}
          selectedValues={undefined}
        />,
      );

      const clearButton = screen.queryByRole("button", {
        name: /reset release year to full range/i,
      });

      expect(clearButton).not.toBeInTheDocument();
    });

    it("shows clear button when range is not full", () => {
      render(
        <YearField
          allValues={mockYears}
          label="Release Year"
          onYearChange={vi.fn()}
          selectedValues={["2021", "2023"]}
        />,
      );

      const clearButton = screen.getByRole("button", {
        name: /reset release year to full range/i,
      });

      expect(clearButton).toBeInTheDocument();
    });

    it("resets to full range when clear button clicked", async () => {
      const user = userEvent.setup();
      const onYearChange = vi.fn();

      render(
        <YearField
          allValues={mockYears}
          label="Release Year"
          onYearChange={onYearChange}
          selectedValues={["2021", "2023"]}
        />,
      );

      const clearButton = screen.getByRole("button", {
        name: /reset release year to full range/i,
      });

      await user.click(clearButton);

      expect(onYearChange).toHaveBeenCalledWith(["2020", "2024"]);
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels for sliders", () => {
      render(
        <YearField
          allValues={mockYears}
          label="Release Year"
          onYearChange={vi.fn()}
          selectedValues={undefined}
        />,
      );

      const fromSlider = screen.getByLabelText("Release Year minimum value");
      const toSlider = screen.getByLabelText("Release Year maximum value");

      expect(fromSlider).toHaveAttribute("aria-valuemin", "2020");
      expect(fromSlider).toHaveAttribute("aria-valuemax", "2024");
      expect(toSlider).toHaveAttribute("aria-valuemin", "2020");
      expect(toSlider).toHaveAttribute("aria-valuemax", "2024");
    });

    it("announces current range to screen readers", () => {
      render(
        <YearField
          allValues={mockYears}
          label="Release Year"
          onYearChange={vi.fn()}
          selectedValues={["2021", "2023"]}
        />,
      );

      const announcement = screen.getByText(/range: 2021 to 2023/i);

      expect(announcement).toBeInTheDocument();
      const liveRegion = announcement.closest('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
    });
  });
});
