import type { JSX } from "react";

import { Button } from "~/components/Button";
import { DebouncedInput } from "~/components/DebouncedInput";
import { SelectField } from "~/components/SelectField";
import { YearInput } from "~/components/YearInput";
import { capitalize } from "~/utils/capitalize";

import type { ActionType } from "./CastAndCrewMember.reducer";

import { Actions } from "./CastAndCrewMember.reducer";

export function Filters({
  creditedAs,
  dispatch,
  distinctReleaseYears,
  distinctReviewYears,
  hideReviewed,
}: {
  creditedAs: readonly string[];
  dispatch: React.Dispatch<ActionType>;
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
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
    </>
  );
}

export function SortOptions() {
  return (
    <>
      <option value="release-date-desc">Release Date (Newest First)</option>
      <option value="release-date-asc">Release Date (Oldest First)</option>
      <option value="title">Title</option>
      <option value="grade-desc">Grade (Best First)</option>
      <option value="grade-asc">Grade (Worst First)</option>
      <option value="review-date-desc">Review Date (Newest First)</option>
      <option value="review-date-asc">Review Date (Oldest First)</option>
    </>
  );
}
