import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { GradeField } from "./GradeField";

describe("GradeField", () => {
  describe("Rendering", () => {
    it("renders field with label", () => {
      render(
        <GradeField
          defaultValues={undefined}
          label="Grade"
          onGradeChange={vi.fn()}
        />,
      );

      const group = screen.getByRole("group", { name: "Grade" });
      expect(group).toBeInTheDocument();
    });

    it("renders from and to dropdowns", () => {
      render(
        <GradeField
          defaultValues={undefined}
          label="Grade"
          onGradeChange={vi.fn()}
        />,
      );

      const fromSelect = screen.getByRole("combobox", { name: /from/i });
      const toSelect = screen.getByRole("combobox", { name: /to/i });

      expect(fromSelect).toBeInTheDocument();
      expect(toSelect).toBeInTheDocument();
    });

    it("renders range slider beneath dropdowns", () => {
      render(
        <GradeField
          defaultValues={undefined}
          label="Grade"
          onGradeChange={vi.fn()}
        />,
      );

      const fromSlider = screen.getByLabelText("Grade minimum value");
      const toSlider = screen.getByLabelText("Grade maximum value");

      expect(fromSlider).toBeInTheDocument();
      expect(toSlider).toBeInTheDocument();
    });

    it("defaults to full range when no default values", () => {
      render(
        <GradeField
          defaultValues={undefined}
          label="Grade"
          onGradeChange={vi.fn()}
        />,
      );

      const fromSelect = screen.getByRole("combobox", {
        name: /from/i,
      });
      const toSelect = screen.getByRole("combobox", {
        name: /to/i,
      });

      expect((fromSelect as HTMLSelectElement).value).toBe("1"); // F
      expect((toSelect as HTMLSelectElement).value).toBe("13"); // A+
    });

    it("uses provided default values", () => {
      render(
        <GradeField
          defaultValues={[8, 11]}
          label="Grade"
          onGradeChange={vi.fn()}
        />,
      );

      const fromSelect = screen.getByRole("combobox", {
        name: /from/i,
      });
      const toSelect = screen.getByRole("combobox", {
        name: /to/i,
      });

      expect((fromSelect as HTMLSelectElement).value).toBe("8"); // B-
      expect((toSelect as HTMLSelectElement).value).toBe("11"); // A-
    });
  });

  describe("Dropdown Interaction", () => {
    it("calls onGradeChange when from dropdown changes", async () => {
      const user = userEvent.setup();
      const onGradeChange = vi.fn();

      render(
        <GradeField
          defaultValues={undefined}
          label="Grade"
          onGradeChange={onGradeChange}
        />,
      );

      const fromSelect = screen.getByRole("combobox", { name: /from/i });
      await user.selectOptions(fromSelect, "8"); // B-

      expect(onGradeChange).toHaveBeenCalledWith([8, 13]);
    });

    it("calls onGradeChange when to dropdown changes", async () => {
      const user = userEvent.setup();
      const onGradeChange = vi.fn();

      render(
        <GradeField
          defaultValues={undefined}
          label="Grade"
          onGradeChange={onGradeChange}
        />,
      );

      const toSelect = screen.getByRole("combobox", { name: /to/i });
      await user.selectOptions(toSelect, "11"); // A-

      expect(onGradeChange).toHaveBeenCalledWith([1, 11]);
    });

    it("swaps values when from exceeds to", async () => {
      const user = userEvent.setup();
      const onGradeChange = vi.fn();

      render(
        <GradeField
          defaultValues={[8, 11]}
          label="Grade"
          onGradeChange={onGradeChange}
        />,
      );

      const fromSelect = screen.getByRole("combobox", { name: /from/i });
      await user.selectOptions(fromSelect, "13"); // A+

      expect(onGradeChange).toHaveBeenCalledWith([11, 13]);
    });

    it("swaps values when to is less than from", async () => {
      const user = userEvent.setup();
      const onGradeChange = vi.fn();

      render(
        <GradeField
          defaultValues={[8, 11]}
          label="Grade"
          onGradeChange={onGradeChange}
        />,
      );

      const toSelect = screen.getByRole("combobox", { name: /to/i });
      await user.selectOptions(toSelect, "5"); // C-

      expect(onGradeChange).toHaveBeenCalledWith([5, 8]);
    });
  });

  describe("Slider Interaction", () => {
    it("calls onGradeChange when from slider changes", () => {
      const onGradeChange = vi.fn();

      render(
        <GradeField
          defaultValues={undefined}
          label="Grade"
          onGradeChange={onGradeChange}
        />,
      );

      const fromSlider = screen.getByLabelText("Grade minimum value");

      fireEvent.change(fromSlider, { target: { value: "8" } });

      expect(onGradeChange).toHaveBeenCalledWith([8, 13]);
    });

    it("calls onGradeChange when to slider changes", () => {
      const onGradeChange = vi.fn();

      render(
        <GradeField
          defaultValues={undefined}
          label="Grade"
          onGradeChange={onGradeChange}
        />,
      );

      const toSlider = screen.getByLabelText("Grade maximum value");

      fireEvent.change(toSlider, { target: { value: "11" } });

      expect(onGradeChange).toHaveBeenCalledWith([1, 11]);
    });

    it("syncs slider with dropdown changes", async () => {
      const user = userEvent.setup();
      const onGradeChange = vi.fn();

      render(
        <GradeField
          defaultValues={undefined}
          label="Grade"
          onGradeChange={onGradeChange}
        />,
      );

      const fromSelect = screen.getByRole("combobox", { name: /from/i });
      await user.selectOptions(fromSelect, "8");

      const fromSlider = screen.getByLabelText(
        "Grade minimum value",
      );

      expect((fromSlider as HTMLInputElement).value).toBe("8");
    });

    it("displays grade letters in slider range display", () => {
      render(
        <GradeField
          defaultValues={[8, 11]}
          label="Grade"
          onGradeChange={vi.fn()}
        />,
      );

      // RangeSliderField shows current range with grade letters
      const rangeDisplay = screen.getByText(/—/); // The dash between range values
      expect(rangeDisplay).toBeInTheDocument();
      // Both grades appear multiple times (in dropdowns and slider display)
      expect(screen.getAllByText("B-").length).toBeGreaterThan(0);
      expect(screen.getAllByText("A-").length).toBeGreaterThan(0);
    });
  });

  describe("Clear Functionality", () => {
    it("does not show clear button when at full range", () => {
      render(
        <GradeField
          defaultValues={undefined}
          label="Grade"
          onGradeChange={vi.fn()}
        />,
      );

      const clearButton = screen.queryByRole("button", {
        name: /reset grade to full range/i,
      });

      expect(clearButton).not.toBeInTheDocument();
    });

    it("shows clear button when range is not full", () => {
      render(
        <GradeField
          defaultValues={[8, 11]}
          label="Grade"
          onGradeChange={vi.fn()}
        />,
      );

      const clearButton = screen.getByRole("button", {
        name: /reset grade to full range/i,
      });

      expect(clearButton).toBeInTheDocument();
    });

    it("resets to full range when clear button clicked", async () => {
      const user = userEvent.setup();
      const onGradeChange = vi.fn();

      render(
        <GradeField
          defaultValues={[8, 11]}
          label="Grade"
          onGradeChange={onGradeChange}
        />,
      );

      const clearButton = screen.getByRole("button", {
        name: /reset grade to full range/i,
      });

      await user.click(clearButton);

      expect(onGradeChange).toHaveBeenCalledWith([1, 13]);
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels for sliders", () => {
      render(
        <GradeField
          defaultValues={undefined}
          label="Grade"
          onGradeChange={vi.fn()}
        />,
      );

      const fromSlider = screen.getByLabelText("Grade minimum value");
      const toSlider = screen.getByLabelText("Grade maximum value");

      expect(fromSlider).toHaveAttribute("aria-valuemin", "1");
      expect(fromSlider).toHaveAttribute("aria-valuemax", "13");
      expect(toSlider).toHaveAttribute("aria-valuemin", "1");
      expect(toSlider).toHaveAttribute("aria-valuemax", "13");
    });

    it("announces current range to screen readers with letter grades", () => {
      render(
        <GradeField
          defaultValues={[8, 11]}
          label="Grade"
          onGradeChange={vi.fn()}
        />,
      );

      const announcement = screen.getByText(/range: B- to A-/i);

      expect(announcement).toBeInTheDocument();
      const liveRegion = announcement.closest('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
    });

    it("uses letter grade in aria-valuetext", () => {
      render(
        <GradeField
          defaultValues={[8, 11]}
          label="Grade"
          onGradeChange={vi.fn()}
        />,
      );

      const fromSlider = screen.getByLabelText("Grade minimum value");
      const toSlider = screen.getByLabelText("Grade maximum value");

      expect(fromSlider).toHaveAttribute("aria-valuetext", "B-");
      expect(toSlider).toHaveAttribute("aria-valuetext", "A-");
    });
  });

  describe("Bidirectional Sync", () => {
    it("updates slider when dropdown changes", async () => {
      const user = userEvent.setup();

      render(
        <GradeField
          defaultValues={undefined}
          label="Grade"
          onGradeChange={vi.fn()}
        />,
      );

      const fromSelect = screen.getByRole("combobox", { name: /from/i });
      const fromSlider = screen.getByLabelText(
        "Grade minimum value",
      );

      await user.selectOptions(fromSelect, "8");

      expect((fromSlider as HTMLInputElement).value).toBe("8");
    });
  });

  describe("Grade Letter Mapping", () => {
    it("displays correct letter grades for all values", () => {
      const testCases = [
        { letter: "F", value: 1 },
        { letter: "D-", value: 2 },
        { letter: "D", value: 3 },
        { letter: "D+", value: 4 },
        { letter: "C-", value: 5 },
        { letter: "C", value: 6 },
        { letter: "C+", value: 7 },
        { letter: "B-", value: 8 },
        { letter: "B", value: 9 },
        { letter: "B+", value: 10 },
        { letter: "A-", value: 11 },
        { letter: "A", value: 12 },
        { letter: "A+", value: 13 },
      ];

      for (const { letter, value } of testCases) {
        const { unmount } = render(
          <GradeField
            defaultValues={[value, value]}
            label="Grade"
            onGradeChange={vi.fn()}
          />,
        );

        const fromSlider = screen.getByLabelText("Grade minimum value");
        expect(fromSlider).toHaveAttribute("aria-valuetext", letter);

        unmount();
      }
    });
  });
});
