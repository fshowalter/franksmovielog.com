import { DebouncedInput } from "~/components/DebouncedInput";
import { GradeInput } from "~/components/GradeInput";
import { MultiSelectField } from "~/components/MultiSelectField";
import { SelectField } from "~/components/SelectField";
import { YearInput } from "~/components/YearInput";

import type { ActionType, Sort } from "./Reviews.reducer";

import { Actions } from "./Reviews.reducer";

export function Filters({
  dispatch,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
}) {
  return (
    <>
      <DebouncedInput
        label="Title"
        onInputChange={(value) =>
          dispatch({ type: Actions.FILTER_TITLE, value })
        }
        placeholder="Enter all or part of a title"
      />
      <YearInput
        label="Release Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.FILTER_RELEASE_YEAR, values })
        }
        years={distinctReleaseYears}
      />
      <YearInput
        label="Review Year"
        onYearChange={(values) =>
          dispatch({ type: Actions.FILTER_REVIEW_YEAR, values })
        }
        years={distinctReviewYears}
      />
      <GradeInput
        label="Grade"
        onGradeChange={(values) =>
          dispatch({
            type: Actions.FILTER_GRADE,
            values,
          })
        }
      />
      <MultiSelectField
        label="Genres"
        onChange={(e) =>
          dispatch({
            type: Actions.FILTER_GENRES,
            values: e.map((selection) => selection.value),
          })
        }
        options={distinctGenres}
      />
    </>
  );
}

export function Sorter({
  dispatch,
  sortValue,
}: {
  dispatch: React.Dispatch<ActionType>;
  sortValue: Sort;
}) {
  return (
    <SelectField
      label="Sorted By"
      onChange={(e) =>
        dispatch({
          type: Actions.SORT,
          value: e.target.value as Sort,
        })
      }
      value={sortValue}
    >
      <option value="title-asc">Title (A &rarr; Z)</option>
      <option value="title-desc">Title (Z &rarr; A)</option>
      <option value="grade-desc">Grade (Best First)</option>
      <option value="grade-asc">Grade (Worst First)</option>
      <option value="release-date-desc">Release Date (Newest First)</option>
      <option value="release-date-asc">Release Date (Oldest First)</option>
      <option value="review-date-desc">Review Date (Newest First)</option>
      <option value="review-date-asc">Review Date (Oldest First)</option>
    </SelectField>
  );
}
