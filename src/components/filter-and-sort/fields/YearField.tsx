import { RangeSliderField } from "./RangeSliderField";
import { SelectInput } from "./SelectInput";

/**
 * Year range selector with from/to dropdowns and range slider.
 * Spec requires BOTH dropdowns and slider - dual control pattern
 * @param props - Component props
 * @param props.defaultValues - Default [min, max] year values
 * @param props.label - Field label text
 * @param props.onClear - Handler for clear action (resets to full range)
 * @param props.onYearChange - Handler for year range changes
 * @param props.years - Available years to select from
 * @returns Year range selector with dropdowns and slider, wrapped in FilterSection
 */
export function YearField({
  allValues,
  label,
  onClear,
  onYearChange,
  selectedValues,
}: {
  allValues: readonly string[];
  label: string;
  onClear?: () => void;
  onYearChange: (values: [string, string]) => void;
  selectedValues: readonly [string, string] | undefined;
}): React.JSX.Element {
  // Convert year strings to numbers for slider
  const minYearNum = Number.parseInt(allValues[0], 10);
  const maxYearNum = Number.parseInt(allValues.at(-1)!, 10);
  const currentMinNum = Number.parseInt(
    minValue(allValues, selectedValues),
    10,
  );
  const currentMaxNum = Number.parseInt(
    maxValue(allValues, selectedValues),
    10,
  );

  const handleMinChange = (value: string): void => {
    const newMin = value;

    if (newMin <= maxValue(allValues, selectedValues)) {
      onYearChange([newMin, maxValue(allValues, selectedValues)]);
    } else {
      onYearChange([maxValue(allValues, selectedValues), newMin]);
    }
  };

  const handleMaxChange = (value: string): void => {
    const newMax = value;

    if (minValue(allValues, selectedValues) <= newMax) {
      onYearChange([minValue(allValues, selectedValues), newMax]);
    } else {
      onYearChange([newMax, minValue(allValues, selectedValues)]);
    }
  };

  // Handle slider changes - snap to nearest valid year in array
  const handleSliderChange = (from: number, to: number): void => {
    // Find closest valid year in the years array
    const fromStr = findClosestYear(allValues, from);
    const toStr = findClosestYear(allValues, to);
    onYearChange([fromStr, toStr]);
  };

  // Clear resets to full range AND calls onClear callback
  // The onClear callback dispatches removeAppliedFilter to immediately update
  // the Applied Filters section (removes the filter from both pending and active)
  const handleClear = (): void => {
    const fullMin = allValues[0];
    const fullMax = allValues.at(-1)!;
    if (onClear) {
      onClear();
    } else {
      onYearChange([fullMin, fullMax]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <fieldset aria-label={label} className="text-subtle">
        <div className="flex items-baseline">
          <label className="flex flex-1 items-center gap-x-[.5ch]">
            <span className="min-w-10 text-left text-sm tracking-serif-wide">
              From
            </span>
            <SelectInput
              defaultValue={minValue(allValues, selectedValues)}
              onChange={(e) => handleMinChange(e.target.value)}
            >
              {allValues.map((year) => {
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </SelectInput>
          </label>
          <label className="flex flex-1 items-center">
            <span className="min-w-10 text-center text-sm tracking-serif-wide">
              to
            </span>
            <SelectInput
              defaultValue={maxValue(allValues, selectedValues)}
              onChange={(e) => handleMaxChange(e.target.value)}
            >
              {[...allValues].reverse().map((year) => {
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </SelectInput>
          </label>
        </div>
      </fieldset>

      {/* Range slider beneath dropdowns - syncs bidirectionally */}
      <RangeSliderField
        fromValue={currentMinNum}
        label={label}
        max={maxYearNum}
        min={minYearNum}
        onChange={handleSliderChange}
        onClear={handleClear}
        toValue={currentMaxNum}
      />
    </div>
  );
}

/**
 * Find the closest year in the years array to the target year.
 * This handles sparse year arrays (e.g., ["1930", "1943", "1978"]) where
 * the slider might select intermediate values that don't exist in the array.
 * @param years - Available years array
 * @param target - Target year number from slider
 * @returns Closest year string from the array
 */
function findClosestYear(years: readonly string[], target: number): string {
  let closest = years[0];
  let minDiff = Math.abs(Number.parseInt(years[0], 10) - target);

  for (const year of years) {
    const yearNum = Number.parseInt(year, 10);
    const diff = Math.abs(yearNum - target);
    if (diff < minDiff) {
      minDiff = diff;
      closest = year;
    }
  }

  return closest;
}

function maxValue(
  allValues: readonly string[],
  selectedValues?: readonly [string, string],
): string {
  return selectedValues ? selectedValues[1] : (allValues.at(-1) as string);
}

function minValue(
  allValues: readonly string[],
  selectedValues?: readonly [string, string],
): string {
  return selectedValues ? selectedValues[0] : allValues[0];
}
