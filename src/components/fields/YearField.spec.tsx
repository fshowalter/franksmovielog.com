import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { YearField } from "./YearField";

const mockYears = ["2020", "2021", "2022", "2023", "2024"];

describe("YearField", () => {
  describe("Rendering", () => {
    it("renders field with label", () => {
      render(
        <YearField
          defaultValues={undefined}
          label="Release Year"
          onYearChange={vi.fn()}
          years={mockYears}
        />,
      );

      const group = screen.getByRole("group", { name: "Release Year" });
      expect(group).toBeInTheDocument();
    });

    it("renders from and to dropdowns", () => {
      render(
        <YearField
          defaultValues={undefined}
          label="Release Year"
          onYearChange={vi.fn()}
          years={mockYears}
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
          defaultValues={undefined}
          label="Release Year"
          onYearChange={vi.fn()}
          years={mockYears}
        />,
      );

      const fromSlider = screen.getByLabelText("Release Year minimum value");
      const toSlider = screen.getByLabelText("Release Year maximum value");

      expect(fromSlider).toBeInTheDocument();
      expect(toSlider).toBeInTheDocument();
    });

    it("defaults to full range when no default values", () => {
      render(
        <YearField
          defaultValues={undefined}
          label="Release Year"
          onYearChange={vi.fn()}
          years={mockYears}
        />,
      );

      const fromSelect = screen.getByRole("combobox", {
        name: /from/i,
      });
      const toSelect = screen.getByRole("combobox", {
        name: /to/i,
      });

      expect((fromSelect as HTMLSelectElement).value).toBe("2020");
      expect((toSelect as HTMLSelectElement).value).toBe("2024");
    });

    it("uses provided default values", () => {
      render(
        <YearField
          defaultValues={["2021", "2023"]}
          label="Release Year"
          onYearChange={vi.fn()}
          years={mockYears}
        />,
      );

      const fromSelect = screen.getByRole("combobox", {
        name: /from/i,
      });
      const toSelect = screen.getByRole("combobox", {
        name: /to/i,
      });

      expect((fromSelect as HTMLSelectElement).value).toBe("2021");
      expect((toSelect as HTMLSelectElement).value).toBe("2023");
    });
  });

  describe("Dropdown Interaction", () => {
    it("calls onYearChange when from dropdown changes", async () => {
      const user = userEvent.setup();
      const onYearChange = vi.fn();

      render(
        <YearField
          defaultValues={undefined}
          label="Release Year"
          onYearChange={onYearChange}
          years={mockYears}
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
          defaultValues={undefined}
          label="Release Year"
          onYearChange={onYearChange}
          years={mockYears}
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
          defaultValues={["2021", "2023"]}
          label="Release Year"
          onYearChange={onYearChange}
          years={mockYears}
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
          defaultValues={["2021", "2023"]}
          label="Release Year"
          onYearChange={onYearChange}
          years={mockYears}
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
          defaultValues={undefined}
          label="Release Year"
          onYearChange={onYearChange}
          years={mockYears}
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
          defaultValues={undefined}
          label="Release Year"
          onYearChange={onYearChange}
          years={mockYears}
        />,
      );

      const toSlider = screen.getByLabelText("Release Year maximum value");

      fireEvent.change(toSlider, { target: { value: "2022" } });

      expect(onYearChange).toHaveBeenCalledWith(["2020", "2022"]);
    });

    it("syncs slider with dropdown changes", async () => {
      const user = userEvent.setup();
      const onYearChange = vi.fn();

      render(
        <YearField
          defaultValues={undefined}
          label="Release Year"
          onYearChange={onYearChange}
          years={mockYears}
        />,
      );

      const fromSelect = screen.getByRole("combobox", { name: /from/i });
      await user.selectOptions(fromSelect, "2022");

      const fromSlider = screen.getByLabelText("Release Year minimum value");

      expect((fromSlider as HTMLInputElement).value).toBe("2022");
    });
  });

  describe("Clear Functionality", () => {
    it("does not show clear button when at full range", () => {
      render(
        <YearField
          defaultValues={undefined}
          label="Release Year"
          onYearChange={vi.fn()}
          years={mockYears}
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
          defaultValues={["2021", "2023"]}
          label="Release Year"
          onYearChange={vi.fn()}
          years={mockYears}
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
          defaultValues={["2021", "2023"]}
          label="Release Year"
          onYearChange={onYearChange}
          years={mockYears}
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
          defaultValues={undefined}
          label="Release Year"
          onYearChange={vi.fn()}
          years={mockYears}
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
          defaultValues={["2021", "2023"]}
          label="Release Year"
          onYearChange={vi.fn()}
          years={mockYears}
        />,
      );

      const announcement = screen.getByText(/range: 2021 to 2023/i);

      expect(announcement).toBeInTheDocument();
      const liveRegion = announcement.closest('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
    });
  });

  describe("Bidirectional Sync", () => {
    it("updates slider when dropdown changes", async () => {
      const user = userEvent.setup();

      render(
        <YearField
          defaultValues={undefined}
          label="Release Year"
          onYearChange={vi.fn()}
          years={mockYears}
        />,
      );

      const fromSelect = screen.getByRole("combobox", { name: /from/i });
      const fromSlider = screen.getByLabelText("Release Year minimum value");

      await user.selectOptions(fromSelect, "2022");

      expect((fromSlider as HTMLInputElement).value).toBe("2022");
    });

    it("resets internal state when defaultValues changes to undefined", async () => {
      const { rerender } = render(
        <YearField
          defaultValues={["2021", "2023"]}
          label="Release Year"
          onYearChange={vi.fn()}
          years={mockYears}
        />,
      );

      // Verify initial state
      expect(
        (screen.getByRole("combobox", { name: /from/i }) as HTMLSelectElement)
          .value,
      ).toBe("2021");
      expect(
        (screen.getByRole("combobox", { name: /to/i }) as HTMLSelectElement)
          .value,
      ).toBe("2023");
      expect(
        (
          screen.getByLabelText(
            "Release Year minimum value",
          ) as HTMLInputElement
        ).value,
      ).toBe("2021");
      expect(
        (
          screen.getByLabelText(
            "Release Year maximum value",
          ) as HTMLInputElement
        ).value,
      ).toBe("2023");

      // Simulate clearing filter via applied filters section
      rerender(
        <YearField
          defaultValues={undefined}
          label="Release Year"
          onYearChange={vi.fn()}
          years={mockYears}
        />,
      );

      // Wait for useEffect to run and state to update - query fresh elements after rerender
      await waitFor(() => {
        expect(
          (screen.getByRole("combobox", { name: /from/i }) as HTMLSelectElement)
            .value,
        ).toBe("2020");
      });

      // Verify full state resets to full range - query fresh elements
      expect(
        (screen.getByRole("combobox", { name: /to/i }) as HTMLSelectElement)
          .value,
      ).toBe("2024");
      expect(
        (
          screen.getByLabelText(
            "Release Year minimum value",
          ) as HTMLInputElement
        ).value,
      ).toBe("2020");
      expect(
        (
          screen.getByLabelText(
            "Release Year maximum value",
          ) as HTMLInputElement
        ).value,
      ).toBe("2024");

      // Clear button should not be visible at full range
      const clearButton = screen.queryByRole("button", {
        name: /reset release year to full range/i,
      });
      expect(clearButton).not.toBeInTheDocument();
    });
  });
});
