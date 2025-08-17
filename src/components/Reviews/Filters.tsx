import type { JSX } from "react";

import { useState } from "react";

import { LabelText } from "~/components/LabelText";
import { MultiSelectField } from "~/components/MultiSelectField";
import { SelectInput } from "~/components/SelectInput";
import { TextFilter } from "~/components/TextFilter";
import { YearInput } from "~/components/YearInput";

import type { ActionType } from "./reducer";

import { Actions } from "./reducer";

type FilterValues = {
  genres?: readonly string[];
  grade?: [number, number];
  releaseYear?: [string, string];
  reviewYear?: [string, string];
  title?: string;
};

export function Filters({
  dispatch,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  filterValues,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  filterValues: FilterValues;
}) {
  return (
    <>
      <TextFilter
        initialValue={filterValues.title || ""}
        label="Title"
        onInputChange={(value) =>
          dispatch({ type: Actions.PENDING_FILTER_TITLE, value })
        }
        placeholder="Enter all or part of a title"
      />
      <YearInput
        initialValues={filterValues.releaseYear || []}
        label="Release Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.PENDING_FILTER_RELEASE_YEAR, values })
        }
        years={distinctReleaseYears}
      />
      <YearInput
        initialValues={filterValues.reviewYear || []}
        label="Review Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.PENDING_FILTER_REVIEW_YEAR, values })
        }
        years={distinctReviewYears}
      />
      <GradeInput
        label="Grade"
        onGradeChange={(values) =>
          dispatch({
            type: Actions.PENDING_FILTER_GRADE,
            values,
          })
        }
      />
      <MultiSelectField
        label="Genres"
        onChange={(values) =>
          dispatch({
            type: Actions.PENDING_FILTER_GENRES,
            values,
          })
        }
        options={distinctGenres}
      />
    </>
  );
}

export function SortOptions() {
  return (
    <>
      <option value="title-asc">Title (A &rarr; Z)</option>
      <option value="title-desc">Title (Z &rarr; A)</option>
      <option value="grade-desc">Grade (Best First)</option>
      <option value="grade-asc">Grade (Worst First)</option>
      <option value="release-date-desc">Release Date (Newest First)</option>
      <option value="release-date-asc">Release Date (Oldest First)</option>
      <option value="review-date-desc">Review Date (Newest First)</option>
      <option value="review-date-asc">Review Date (Oldest First)</option>
    </>
  );
}

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

function GradeInput({
  label,
  onGradeChange,
}: {
  label: string;
  onGradeChange: (values: [number, number]) => void;
}): JSX.Element {
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(13);

  const handleMinChange = (value: string) => {
    const newMin = Number.parseInt(value, 10);
    setMinValue(newMin);

    if (newMin <= maxValue) {
      onGradeChange([newMin, maxValue]);
    } else {
      onGradeChange([maxValue, newMin]);
    }
  };

  const handleMaxChange = (value: string) => {
    const newMax = Number.parseInt(value, 10);
    setMaxValue(newMax);

    if (minValue <= newMax) {
      onGradeChange([minValue, newMax]);
    } else {
      onGradeChange([newMax, minValue]);
    }
  };

  return (
    <fieldset className="text-subtle">
      <LabelText as="legend" value={label} />
      <div className="flex flex-wrap items-baseline">
        <label className="flex flex-1 items-center gap-x-[.5ch]">
          <span className="min-w-10 text-left text-sm tracking-serif-wide">
            From
          </span>
          <SelectInput
            onChange={(e) => handleMinChange(e.target.value)}
            value={minValue}
          >
            {[...gradeOptions].reverse()}
          </SelectInput>
        </label>
        <label className="flex flex-1 items-center">
          <span className="min-w-10 text-center text-sm tracking-serif-wide">
            to
          </span>
          <SelectInput
            onChange={(e) => handleMaxChange(e.target.value)}
            value={maxValue}
          >
            {[...gradeOptions]}
          </SelectInput>
        </label>
      </div>
    </fieldset>
  );
}
