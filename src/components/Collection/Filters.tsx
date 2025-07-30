import type { JSX } from "react";

import { Button } from "~/components/Button";
import { DebouncedInput } from "~/components/DebouncedInput";
import { YearInput } from "~/components/YearInput";

import type { ActionType } from "./Collection.reducer";

import { Actions } from "./Collection.reducer";

export function Filters({
  dispatch,
  distinctReleaseYears,
  distinctReviewYears,
  hideReviewed,
  showHideReviewed,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  hideReviewed: boolean;
  showHideReviewed: boolean;
}): JSX.Element {
  return (
    <>
      {showHideReviewed && (
        <div className="flex basis-full flex-col items-center justify-end">
          <Button onClick={() => dispatch({ type: Actions.TOGGLE_REVIEWED })}>
            {hideReviewed ? "Show Reviewed" : "Hide Reviewed"}
          </Button>
        </div>
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
