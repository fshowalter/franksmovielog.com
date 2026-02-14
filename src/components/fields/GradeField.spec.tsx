import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

      expect((fromSelect as HTMLSelectElement).value).toBe("2"); // F-
      expect((toSelect as HTMLSelectElement).value).toBe("16"); // A+
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
      await user.selectOptions(fromSelect, "8"); // C-

      expect(onGradeChange).toHaveBeenCalledWith([8, 16]);
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
      await user.selectOptions(toSelect, "14"); // A-

      expect(onGradeChange).toHaveBeenCalledWith([2, 14]);
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

      expect(onGradeChange).toHaveBeenCalledWith([8, 16]);
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

      fireEvent.change(toSlider, { target: { value: "14" } });

      expect(onGradeChange).toHaveBeenCalledWith([2, 14]);
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

      const fromSlider = screen.getByLabelText("Grade minimum value");

      expect((fromSlider as HTMLInputElement).value).toBe("8");
    });

    it("displays grade letters in slider range display", () => {
      render(
        <GradeField
          defaultValues={[11, 14]}
          label="Grade"
          onGradeChange={vi.fn()}
        />,
      );

      // RangeSliderField shows current range with grade letters
      const rangeDisplay = screen.getByText(/Range: B- to A-/);
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

      expect(onGradeChange).toHaveBeenCalledWith([2, 16]);
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

      expect(fromSlider).toHaveAttribute("aria-valuemin", "2");
      expect(fromSlider).toHaveAttribute("aria-valuemax", "16");
      expect(toSlider).toHaveAttribute("aria-valuemin", "2");
      expect(toSlider).toHaveAttribute("aria-valuemax", "16");
    });

    it("announces current range to screen readers with letter grades", () => {
      render(
        <GradeField
          defaultValues={[11, 14]}
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
          defaultValues={[11, 14]}
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
      const fromSlider = screen.getByLabelText("Grade minimum value");

      await user.selectOptions(fromSelect, "8");

      expect((fromSlider as HTMLInputElement).value).toBe("8");
    });

    it("resets internal state when defaultValues changes to undefined", async () => {
      const { rerender } = render(
        <GradeField
          defaultValues={[8, 11]}
          label="Grade"
          onGradeChange={vi.fn()}
        />,
      );

      // Verify initial state
      expect(
        (screen.getByRole("combobox", { name: /from/i }))
          .value,
      ).toBe("8");
      expect(
        (screen.getByRole("combobox", { name: /to/i }))
          .value,
      ).toBe("11");
      expect(
        (screen.getByLabelText("Grade minimum value"))
          .value,
      ).toBe("8");
      expect(
        (screen.getByLabelText("Grade maximum value"))
          .value,
      ).toBe("11");

      // Simulate clearing filter via applied filters section
      rerender(
        <GradeField
          defaultValues={undefined}
          label="Grade"
          onGradeChange={vi.fn()}
        />,
      );

      // Wait for useEffect to run and state to update - query fresh elements after rerender
      await waitFor(() => {
        expect(
          (screen.getByRole("combobox", { name: /from/i }))
            .value,
        ).toBe("2"); // F-
      });

      // Verify full state resets to full range - query fresh elements
      expect(
        (screen.getByRole("combobox", { name: /to/i }))
          .value,
      ).toBe("16"); // A+
      expect(
        (screen.getByLabelText("Grade minimum value"))
          .value,
      ).toBe("2");
      expect(
        (screen.getByLabelText("Grade maximum value"))
          .value,
      ).toBe("16");

      // Clear button should not be visible at full range
      const clearButton = screen.queryByRole("button", {
        name: /reset grade to full range/i,
      });
      expect(clearButton).not.toBeInTheDocument();
    });
  });

  describe("Grade Letter Mapping", () => {
    it("displays correct letter grades for all values", () => {
      const testCases = [
        { letter: "F-", value: 2 },
        { letter: "F", value: 3 },
        { letter: "F+", value: 4 },
        { letter: "D-", value: 5 },
        { letter: "D", value: 6 },
        { letter: "D+", value: 7 },
        { letter: "C-", value: 8 },
        { letter: "C", value: 9 },
        { letter: "C+", value: 10 },
        { letter: "B-", value: 11 },
        { letter: "B", value: 12 },
        { letter: "B+", value: 13 },
        { letter: "A-", value: 14 },
        { letter: "A", value: 15 },
        { letter: "A+", value: 16 },
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
