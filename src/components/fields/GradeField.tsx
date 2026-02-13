import { useState } from "react";

import { FilterSection } from "~/components/filter-and-sort/FilterSection";

import { RangeSliderField } from "./RangeSliderField";
import { SelectInput } from "./SelectInput";

const gradeOptions = [
  <option key={13} value={13}>
    A+
  </option>,
  <option key={12} value={12}>
    A
  </option>,
  <option key={11} value={11}>
    A-
  </option>,
  <option key={10} value={10}>
    B+
  </option>,
  <option key={9} value={9}>
    B
  </option>,
  <option key={8} value={8}>
    B-
  </option>,
  <option key={7} value={7}>
    C+
  </option>,
  <option key={6} value={6}>
    C
  </option>,
  <option key={5} value={5}>
    C-
  </option>,
  <option key={4} value={4}>
    D+
  </option>,
  <option key={3} value={3}>
    D
  </option>,
  <option key={2} value={2}>
    D-
  </option>,
  <option key={1} value={1}>
    F
  </option>,
];

// AIDEV-NOTE: Grade number to letter mapping for slider display
const gradeToLetter = (grade: number): string => {
  const gradeMap: Record<number, string> = {
    1: "F",
    2: "D-",
    3: "D",
    4: "D+",
    5: "C-",
    6: "C",
    7: "C+",
    8: "B-",
    9: "B",
    10: "B+",
    11: "A-",
    12: "A",
    13: "A+",
  };
  return gradeMap[grade] || grade.toString();
};

/**
 * Grade range selector with from/to letter grade dropdowns and range slider.
 * AIDEV-NOTE: Spec requires BOTH dropdowns and slider - dual control pattern
 * @param props - Component props
 * @param props.defaultValues - Default [min, max] grade values
 * @param props.label - Field label text
 * @param props.onGradeChange - Handler for grade range changes
 * @returns Grade range selector with dropdowns and slider
 */
export function GradeField({
  defaultValues,
  label,
  onGradeChange,
}: {
  defaultValues: [number, number] | undefined;
  label: string;
  onGradeChange: (values: [number, number]) => void;
}): React.JSX.Element {
  const [minValue, setMinValue] = useState(defaultMinValue(defaultValues));
  const [maxValue, setMaxValue] = useState(defaultMaxValue(defaultValues));

  const handleMinChange = (value: string): void => {
    const newMin = Number.parseInt(value, 10);
    setMinValue(newMin);

    if (newMin <= maxValue) {
      onGradeChange([newMin, maxValue]);
    } else {
      onGradeChange([maxValue, newMin]);
    }
  };

  const handleMaxChange = (value: string): void => {
    const newMax = Number.parseInt(value, 10);
    setMaxValue(newMax);

    if (minValue <= newMax) {
      onGradeChange([minValue, newMax]);
    } else {
      onGradeChange([newMax, minValue]);
    }
  };

  // AIDEV-NOTE: Handle slider changes - updates dropdowns bidirectionally
  const handleSliderChange = (from: number, to: number): void => {
    setMinValue(from);
    setMaxValue(to);
    onGradeChange([from, to]);
  };

  // AIDEV-NOTE: Clear resets to full range (F to A+)
  const handleClear = (): void => {
    setMinValue(1);
    setMaxValue(13);
    onGradeChange([1, 13]);
  };

  return (
    <FilterSection title={label}>
      <div className="flex flex-col gap-4">
        <fieldset className="text-subtle">
          <div className="flex flex-wrap items-baseline">
            <label className="flex flex-1 items-center gap-x-[.5ch]">
              <span className="min-w-10 text-left text-sm tracking-serif-wide">
                From
              </span>
              <SelectInput
                defaultValue={defaultMinValue(defaultValues)}
                onChange={(e) => handleMinChange(e.target.value)}
              >
                {[...gradeOptions].reverse()}
              </SelectInput>
            </label>
            <label className="flex flex-1 items-center">
              <span className="min-w-10 text-center text-sm tracking-serif-wide">
                to
              </span>
              <SelectInput
                defaultValue={defaultMaxValue(defaultValues)}
                onChange={(e) => handleMaxChange(e.target.value)}
              >
                {[...gradeOptions]}
              </SelectInput>
            </label>
          </div>
        </fieldset>

        {/* AIDEV-NOTE: Range slider beneath dropdowns - syncs bidirectionally */}
        <RangeSliderField
          formatValue={gradeToLetter}
          fromValue={minValue}
          label={label}
          max={13}
          min={1}
          onChange={handleSliderChange}
          onClear={handleClear}
          toValue={maxValue}
        />
      </div>
    </FilterSection>
  );
}

function defaultMaxValue(selectedValues?: [number, number]): number {
  return selectedValues ? selectedValues[1] : 13;
}

function defaultMinValue(selectedValues?: [number, number]): number {
  return selectedValues ? selectedValues[0] : 1;
}
