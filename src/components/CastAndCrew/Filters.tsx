import type { JSX } from "react";

import { SelectField } from "~/components/SelectField";
import { TextFilter } from "~/components/TextFilter";

import type { ActionType } from "./CastAndCrew.reducer";

import { Actions } from "./CastAndCrew.reducer";

type FilterValues = {
  credits?: string;
  name?: string;
};

export function Filters({
  dispatch,
  filterValues,
}: {
  dispatch: React.Dispatch<ActionType>;
  filterValues: FilterValues;
}): JSX.Element {
  return (
    <>
      <TextFilter
        initialValue={filterValues.name || ""}
        label="Name"
        onInputChange={(value) =>
          dispatch({ type: Actions.PENDING_FILTER_NAME, value })
        }
        placeholder="Enter all or part of a name"
      />
      <SelectField
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
