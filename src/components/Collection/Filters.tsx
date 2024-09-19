import { Button } from "src/components/Button";
import { DebouncedInput } from "src/components/DebouncedInput";
import { SelectField } from "src/components/SelectField";
import { YearInput } from "src/components/YearInput";

import { Actions, type ActionType, type Sort } from "./Collection.reducer";

export function Filters({
  dispatch,
  distinctReleaseYears,
  hideReviewed,
  sortValue,
  showHideReviewed,
}: {
  dispatch: React.Dispatch<ActionType>;
  showHideReviewed: boolean;
  hideReviewed: boolean;
  distinctReleaseYears: readonly string[];
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
        placeholder="Enter all or part of a title"
        onInputChange={(value) =>
          dispatch({ type: Actions.FILTER_TITLE, value })
        }
      />

      <YearInput
        label="Release Year"
        years={distinctReleaseYears}
        onYearChange={(values) =>
          dispatch({ type: Actions.FILTER_RELEASE_YEAR, values })
        }
      />
      <SelectField
        className="basis-full"
        value={sortValue}
        label="Sort"
        onChange={(e) =>
          dispatch({
            type: Actions.SORT,
            value: e.target.value as Sort,
          })
        }
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
