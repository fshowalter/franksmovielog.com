import { useState } from "react";

import { SelectInput } from "./SelectInput";

const options = [
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

export function GradeInput({
  label,
  onGradeChange,
}: {
  label: string;
  onGradeChange: (values: [number, number]) => void;
}): JSX.Element {
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(13);

  const handleMinChange = (value: string) => {
    const newMin = parseInt(value, 10);
    setMinValue(newMin);

    if (newMin <= maxValue) {
      onGradeChange([newMin, maxValue]);
    } else {
      onGradeChange([maxValue, newMin]);
    }
  };

  const handleMaxChange = (value: string) => {
    const newMax = parseInt(value, 10);
    setMaxValue(newMax);

    if (minValue <= newMax) {
      onGradeChange([minValue, newMax]);
    } else {
      onGradeChange([newMax, minValue]);
    }
  };

  return (
    <fieldset className="text-subtle">
      <legend className="font-sans-narrow h-6 text-left text-xs uppercase tracking-0.5px text-subtle">
        {label}
      </legend>
      <div className="flex flex-wrap items-baseline">
        <label className="flex flex-1 items-center gap-x-[.5ch]">
          <span className="min-w-10 text-left text-sm tracking-0.5px">
            From
          </span>
          <SelectInput
            value={minValue}
            onChange={(e) => handleMinChange(e.target.value)}
          >
            {options.slice().reverse()}
          </SelectInput>
        </label>
        <label className="flex flex-1 items-center">
          <span className="min-w-10 text-center text-sm tracking-0.5px">
            to
          </span>
          <SelectInput
            value={maxValue}
            onChange={(e) => handleMaxChange(e.target.value)}
          >
            {options.slice()}
          </SelectInput>
        </label>
      </div>
    </fieldset>
  );
}
