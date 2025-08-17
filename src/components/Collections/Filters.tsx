import type { JSX } from "react";

import { TextFilter } from "~/components/TextFilter";

import type { ActionType } from "./Collections.reducer";

import { Actions } from "./Collections.reducer";

type FilterValues = {
  name?: string;
};

export function Filters({
  dispatch,
  filterKey,
  filterValues,
}: {
  dispatch: React.Dispatch<ActionType>;
  filterKey?: string;
  filterValues: FilterValues;
}): JSX.Element {
  return (
    <>
      <TextFilter
        initialValue={filterValues.name || ""}
        key={`name-${filterKey}`}
        label="Name"
        onInputChange={(value) =>
          dispatch({ type: Actions.PENDING_FILTER_NAME, value })
        }
        placeholder="Enter all or part of a name"
      />
    </>
  );
}

export function SortOptions() {
  return (
    <>
      <option value="name-asc">Name (A &rarr; Z)</option>
      <option value="name-desc">Name (Z &rarr; A)</option>
      <option value="title-count-desc">Title Count (Most First)</option>
      <option value="title-count-asc">Title Count (Fewest First)</option>
      <option value="review-count-desc">Review Count (Most First)</option>
      <option value="review-count-asc">Review Count (Fewest First)</option>
    </>
  );
}
