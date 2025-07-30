import type { JSX } from "react";

import { DebouncedInput } from "~/components/DebouncedInput";
import { SelectField } from "~/components/SelectField";

import type { ActionType } from "./CastAndCrew.reducer";

import { Actions } from "./CastAndCrew.reducer";

export function Filters({
  dispatch,
}: {
  dispatch: React.Dispatch<ActionType>;
}): JSX.Element {
  return (
    <>
      <DebouncedInput
        label="Name"
        onInputChange={(value) =>
          dispatch({ type: Actions.FILTER_NAME, value })
        }
        placeholder="Enter all or part of a name"
      />
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
        <option value="director">Director</option>
        <option value="writer">Writer</option>
        <option value="performer">Performer</option>
      </SelectField>
    </>
  );
}

export function SortOptions() {
  return (
    <>
      <option value="name-asc">Name (A &rarr; Z)</option>
      <option value="name-desc">Name (Z &rarr; A)</option>
      <option value="review-count-desc">Review Count (Most First)</option>
      <option value="review-count-asc">Review Count (Fewest First)</option>
    </>
  );
}
