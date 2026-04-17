import type { GradeValue } from "~/utils/grades";

import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { RangeSliderField } from "~/components/filter-and-sort/fields/RangeSliderField";
import { SelectInput } from "~/components/filter-and-sort/fields/SelectInput";
import {
  GRADE_MAX,
  GRADE_MIN,
  GRADE_VALUE_TO_LETTER,
  gradeValueToLetter,
} from "~/utils/grades";

import type { GradeFilterChangedAction } from "./gradeReducer";

import { createGradeFilterChangedAction } from "./gradeReducer";

const gradeOptions = Object.entries(GRADE_VALUE_TO_LETTER).map(
  ([key, value]) => (
    <option key={key} value={Number(key)}>
      {value}
    </option>
  ),
);

const gradeOptionsReversed = [...gradeOptions].reverse();

export function GradeFacet({
  dispatch,
  selectedValues,
}: {
  dispatch: React.Dispatch<GradeFilterChangedAction>;
  selectedValues: [GradeValue, GradeValue] | undefined;
}): React.JSX.Element {
  const onGradeChange = (newValues: [GradeValue, GradeValue]): void =>
    dispatch(createGradeFilterChangedAction(newValues));

  const handleMinChange = (value: string): void => {
    const newMin = Number.parseInt(value, 10) as GradeValue;

    if (newMin <= maxValue(selectedValues)) {
      onGradeChange([newMin, maxValue(selectedValues)]);
    } else {
      onGradeChange([maxValue(selectedValues), newMin]);
    }
  };

  const handleMaxChange = (value: string): void => {
    const newMax = Number.parseInt(value, 10) as GradeValue;

    if (minValue(selectedValues) <= newMax) {
      onGradeChange([minValue(selectedValues), newMax]);
    } else {
      onGradeChange([newMax, minValue(selectedValues)]);
    }
  };

  // Handle slider changes - updates dropdowns bidirectionally
  const handleSliderChange = (from: GradeValue, to: GradeValue): void => {
    onGradeChange([from, to]);
  };

  const handleClear = (): void => {
    onGradeChange([GRADE_MIN, GRADE_MAX]);
  };

  return (
    <AnimatedDetailsDisclosure title={"Grade"}>
      <div className="flex flex-col gap-4">
        <fieldset aria-label={"Grade"} className="text-subtle">
          <div className="flex flex-wrap items-baseline">
            <label className="flex flex-1 items-center gap-x-[.5ch]">
              <span className="min-w-10 text-left text-sm tracking-serif-wide">
                From
              </span>
              <SelectInput
                defaultValue={minValue(selectedValues)}
                onChange={(e) => handleMinChange(e.target.value)}
              >
                {[...gradeOptionsReversed]}
              </SelectInput>
            </label>
            <label className="flex flex-1 items-center">
              <span className="min-w-10 text-center text-sm tracking-serif-wide">
                to
              </span>
              <SelectInput
                defaultValue={maxValue(selectedValues)}
                onChange={(e) => handleMaxChange(e.target.value)}
              >
                {[...gradeOptions]}
              </SelectInput>
            </label>
          </div>
        </fieldset>

        {/* Range slider beneath dropdowns - syncs bidirectionally */}
        <RangeSliderField
          formatValue={gradeValueToLetter}
          fromValue={minValue(selectedValues)}
          label={"Grade"}
          max={GRADE_MAX}
          min={GRADE_MIN}
          onChange={handleSliderChange}
          onClear={handleClear}
          toValue={maxValue(selectedValues)}
        />
      </div>
    </AnimatedDetailsDisclosure>
  );
}

function maxValue(selectedValues?: [GradeValue, GradeValue]): GradeValue {
  return selectedValues ? selectedValues[1] : GRADE_MAX;
}

function minValue(selectedValues?: [GradeValue, GradeValue]): GradeValue {
  return selectedValues ? selectedValues[0] : GRADE_MIN;
}
