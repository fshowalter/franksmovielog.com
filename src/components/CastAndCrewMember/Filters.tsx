import { Button } from "src/components/Button";
import { DebouncedInput } from "src/components/DebouncedInput";
import { SelectField } from "src/components/SelectField";
import { YearInput } from "src/components/YearInput";
import { capitalize } from "src/utils/capitalize";

import {
  Actions,
  type ActionType,
  type Sort,
} from "./CastAndCrewMember.reducer";

export function Filters({
  dispatch,
  distinctReleaseYears,
  hideReviewed,
  sortValue,
  creditedAs,
}: {
  dispatch: React.Dispatch<ActionType>;
  hideReviewed: boolean;
  distinctReleaseYears: readonly string[];
  creditedAs: readonly string[];
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
