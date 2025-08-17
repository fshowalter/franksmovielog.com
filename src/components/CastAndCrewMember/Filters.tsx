import type { JSX } from "react";

import { Button } from "~/components/Button";
import { SelectField } from "~/components/SelectField";
import { TextFilter } from "~/components/TextFilter";
import { YearInput } from "~/components/YearInput";
import { capitalize } from "~/utils/capitalize";

import type { ActionType } from "./CastAndCrewMember.reducer";

import { Actions } from "./CastAndCrewMember.reducer";

type FilterValues = {
  credits?: string;
  releaseYear?: [string, string];
  reviewYear?: [string, string];
  title?: string;
};

export function Filters({
  creditedAs,
  dispatch,
  distinctReleaseYears,
  distinctReviewYears,
  filterValues,
  hideReviewed,
}: {
  creditedAs: readonly string[];
  dispatch: React.Dispatch<ActionType>;
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  filterValues: FilterValues;
  hideReviewed: boolean;
}): JSX.Element {
  return (
    <>
      <Button onClick={() => dispatch({ type: Actions.TOGGLE_REVIEWED })}>
        {hideReviewed ? "Show Reviewed" : "Hide Reviewed"}
      </Button>
      {creditedAs.length > 1 && (
        <SelectField
          className="basis-full"
          label="Credits"
          onChange={(e) =>
            dispatch({
              type: Actions.PENDING_FILTER_CREDIT_KIND,
              value: e.target.value,
            })
          }
          value={filterValues.credits || "All"}
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
