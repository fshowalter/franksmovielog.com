import type { JSX } from "react";

import { DebouncedInput } from "~/components/DebouncedInput";

import type { ActionType } from "./Collections.reducer";

import { Actions } from "./Collections.reducer";

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
