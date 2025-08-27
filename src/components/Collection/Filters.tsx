import type { JSX } from "react";

import { SelectField } from "~/components/SelectField";
import { TextFilter } from "~/components/TextFilter";
import { YearInput } from "~/components/YearInput";

import type { ActionType } from "./Collection.reducer";

import { Actions } from "./Collection.reducer";

type FilterValues = {
  releaseYear?: [string, string];
  reviewYear?: [string, string];
  title?: string;
};

export function Filters({
  dispatch,
  distinctReleaseYears,
  distinctReviewYears,
  filterValues,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  filterValues: FilterValues;
}): JSX.Element {
  return (
    <>
      <SelectField
        label="Reviewed Status"
        onChange={(e) =>
          dispatch({
            type: Actions.PENDING_FILTER_REVIEW_STATUS,
            value: e.target.value,
          })
        }
      >
        <option key={0} value={"All"}>
          All
        </option>
        <option key={1} value={"Reviewed"}>
          Reviewed
        </option>
        <option key={2} value={"Not Reviewed"}>
          Not Reviewed
        </option>
      </SelectField>
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
    </>
  );
}

export function SortOptions() {
  return (
    <>
      <option value="release-date-desc">Release Date (Newest First)</option>
      <option value="release-date-asc">Release Date (Oldest First)</option>
      <option value="title-asc">Title (A &rarr; Z)</option>
      <option value="title-desc">Title (Z &rarr; A)</option>
      <option value="grade-desc">Grade (Best First)</option>
      <option value="grade-asc">Grade (Worst First)</option>
      <option value="review-date-desc">Review Date (Newest First)</option>
      <option value="review-date-asc">Review Date (Oldest First)</option>
    </>
  );
}
