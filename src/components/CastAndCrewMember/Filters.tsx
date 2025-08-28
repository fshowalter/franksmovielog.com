import type { JSX } from "react";

import { GradeInput } from "~/components/GradeInput";
import { MultiSelectField } from "~/components/MultiSelectField";
import { ReviewedStatusField } from "~/components/ReviewedStatusField";
import { SelectField } from "~/components/SelectField";
import { TextFilter } from "~/components/TextFilter";
import { YearInput } from "~/components/YearInput";
import { capitalize } from "~/utils/capitalize";

import type { ActionType } from "./CastAndCrewMember.reducer";

import { Actions } from "./CastAndCrewMember.reducer";

type FilterValues = {
  credits?: string;
  genres?: readonly string[];
  releaseYear?: [string, string];
  reviewStatus?: number;
  reviewYear?: [string, string];
  title?: string;
};

export function Filters({
  creditedAs,
  dispatch,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  filterValues,
}: {
  creditedAs: readonly string[];
  dispatch: React.Dispatch<ActionType>;
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  filterValues: FilterValues;
}): JSX.Element {
  return (
    <>
      {creditedAs.length > 1 && (
        <SelectField
          label="Credits"
          onChange={(e) =>
            dispatch({
              type: Actions.PENDING_FILTER_CREDIT_KIND,
              value: e.target.value,
            })
          }
        >
          <option value="All">All</option>
          {creditedAs.map((credit) => {
            return (
              <option key={credit} value={credit}>
                {capitalize(credit)}
              </option>
            );
          })}
        </SelectField>
      )}
      <ReviewedStatusField
        onChange={(e) =>
          dispatch({
            type: Actions.PENDING_FILTER_REVIEW_STATUS,
            value: e.target.value,
          })
        }
      />

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
