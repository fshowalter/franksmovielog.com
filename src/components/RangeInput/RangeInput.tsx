import React from "react";
import ReactSlider from "react-slider";
import {
  containerCss,
  draggingCss,
  fromCss,
  inputLabelCss,
  labelCss,
  sliderCss,
  thumbCss,
  toCss,
  trackCss,
  yearInputCss,
} from "./RangeInput.module.scss";

/**
 * Renders a dual-handle range slider.
 */
export default function RangeFilter({
  label,
  min,
  max,
  onChange,
}: {
  /** The label text. */
  label: string;
  /** The lowest number in the range. */
  min: number;
  /** The highest number in the range. */
  max: number;
  /** Handler called when the control changes. */
  onChange: (values: [number, number]) => void;
}): JSX.Element {
  const initialState: [number, number] = [min, max];

  const [state, setState] = React.useState(initialState.slice());

  /**
   * Validates a given pair of values fall within the min and max.
   * @param values The values to validate.
   */
  const valuesAreValid = (values: [number, number]) => {
    return (
      values[0] >= min &&
      values[0] <= values[1] &&
      values[0] >= min &&
      values[1] <= max
    );
  };

  const handleSliderUpdate = (values: number | number[] | null | undefined) => {
    if (!Array.isArray(values)) {
      return;
    }
    onChange(values as [number, number]);
  };

  const handleSliderChange = (values: number | number[] | null | undefined) => {
    if (!Array.isArray(values)) {
      return;
    }

    setState([...values]);
  };

  const handleMinChange = (value: string) => {
    const newState: [number, number] = [parseInt(value, 10), state[1]];

    if (isNaN(newState[0])) {
      newState[0] = 0;
    }

    setState(newState);

    if (valuesAreValid(newState)) {
      onChange(newState);
    }
  };

  const handleMaxChange = (value: string) => {
    const newState: [number, number] = [state[0], parseInt(value, 10)];

    if (isNaN(newState[1])) {
      newState[1] = 0;
    }

    setState(newState);

    if (valuesAreValid(newState)) {
      onChange(newState);
    }
  };

  return (
    <fieldset className={containerCss}>
      <legend className={labelCss}>{label}</legend>
      <ReactSlider
        value={state}
        max={max}
        min={min}
        onChange={handleSliderChange}
        onAfterChange={handleSliderUpdate}
        thumbClassName={thumbCss}
        trackClassName={trackCss}
        thumbActiveClassName={draggingCss}
        className={sliderCss}
      />
      <label className={inputLabelCss}>
        <span className={fromCss}>From </span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          minLength={4}
          maxLength={4}
          value={state[0]}
          step="1"
          onChange={(e) => handleMinChange(e.target.value)}
          className={yearInputCss}
        />
      </label>
      <label className={inputLabelCss}>
        <span className={toCss}>To </span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={state[1]}
          minLength={4}
          maxLength={4}
          onChange={(e) => handleMaxChange(e.target.value)}
          step="1"
          className={`${yearInputCss}`}
        />
      </label>
    </fieldset>
  );
}
