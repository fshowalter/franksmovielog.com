import { DebouncedInput } from "src/components/DebouncedInput";
import { MultiSelectField } from "src/components/MultiSelectField";
import { SelectField } from "src/components/SelectField";
import { YearInput } from "src/components/YearInput";

import type { Sort } from "./Underseen.reducer";
import type { ActionType } from "./Underseen.reducer";
import { Actions } from "./Underseen.reducer";

export function Filters({
  dispatch,
  sortValue,
  distinctReleaseYears,
  distinctGenres,
}: {
  dispatch: React.Dispatch<ActionType>;
  sortValue: Sort;
  distinctReleaseYears: readonly string[];
  distinctGenres: readonly string[];
}) {
  return (
    <>
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
      <MultiSelectField
        label="Genres"
        onChange={(e) =>
          dispatch({
            type: Actions.FILTER_GENRES,
            values: e.map((selection) => selection.value),
          })
        }
        options={distinctGenres}
      />
      <SelectField
        value={sortValue}
        label="Sort"
        onChange={(e) =>
          dispatch({
            type: Actions.SORT,
            value: e.target.value as Sort,
          })
        }
      >
        <option value="title-asc">Title (A &rarr; Z)</option>
        <option value="title-desc">Title (Z &rarr; A)</option>
        <option value="grade-desc">Grade (Best First)</option>
        <option value="grade-asc">Grade (Worst First)</option>
        <option value="release-date-desc">Release Date (Newest First)</option>
        <option value="release-date-asc">Release Date (Oldest First)</option>
      </SelectField>
    </>
  );
}
