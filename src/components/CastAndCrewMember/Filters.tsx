import type { JSX } from "react";

import { Button } from "~/components/Button";
import { DebouncedInput } from "~/components/DebouncedInput";
import { SelectField } from "~/components/SelectField";
import { YearInput } from "~/components/YearInput";
import { capitalize } from "~/utils/capitalize";

import {
  Actions,
  type ActionType,
  type Sort,
} from "./CastAndCrewMember.reducer";

export function Filters({
  creditedAs,
  dispatch,
  distinctReleaseYears,
  distinctReviewYears,
  hideReviewed,
  sortValue,
}: {
  creditedAs: readonly string[];
  dispatch: React.Dispatch<ActionType>;
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  hideReviewed: boolean;
  sortValue: Sort;
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
              type: Actions.FILTER_CREDIT_KIND,
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
      <SelectField
        className="basis-full"
        label="Sort"
        onChange={(e) =>
          dispatch({
            type: Actions.SORT,
            value: e.target.value as Sort,
          })
        }
        value={sortValue}
      >
        <option value="release-date-desc">Release Date (Newest First)</option>
        <option value="release-date-asc">Release Date (Oldest First)</option>
        <option value="title">Title</option>
        <option value="grade-desc">Grade (Best First)</option>
        <option value="grade-asc">Grade (Worst First)</option>
        <option value="review-date-desc">Review Date (Newest First)</option>
        <option value="review-date-asc">Review Date (Oldest First)</option>
      </SelectField>
    </>
  );
}
