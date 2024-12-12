import type { JSX } from "react";

import { Button } from "~/components/Button";
import { DebouncedInput } from "~/components/DebouncedInput";
import { SelectField } from "~/components/SelectField";
import { YearInput } from "~/components/YearInput";

import { Actions, type ActionType, type Sort } from "./Collection.reducer";

export function Filters({
  dispatch,
  distinctReleaseYears,
  hideReviewed,
  showHideReviewed,
  sortValue,
}: {
  dispatch: React.Dispatch<ActionType>;
  distinctReleaseYears: readonly string[];
  hideReviewed: boolean;
  showHideReviewed: boolean;
  sortValue: Sort;
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
      </SelectField>
    </>
  );
}
