import { GradeInput } from "~/components/GradeInput";
import { MultiSelectField } from "~/components/MultiSelectField";
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
