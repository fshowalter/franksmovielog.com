import { AnimatedDetailsDisclosure } from "~/components/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/fields/CheckboxListField";
import { GradeField } from "~/components/fields/GradeField";
import { TextField } from "~/components/fields/TextField";
import { YearField } from "~/components/fields/YearField";

import type { ReviewsAction, ReviewsFiltersValues } from "./reducer";
import type { ReviewsValue } from "./ReviewsListItem";

import { calculateGenreCounts } from "./filteredReviews";
import {
  createGenresFilterChangedAction,
  createGradeFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createRemoveAppliedFilterAction,
  createReviewYearFilterChangedAction,
  createTitleFilterChangedAction,
} from "./reducer";

/**
 * Filter controls for the reviews page.
 * @param props - Component props
 * @param props.dispatch - Reducer dispatch function for filter actions
 * @param props.distinctGenres - Available genres for filtering
 * @param props.distinctReleaseYears - Available release years for filtering
 * @param props.distinctReviewYears - Available review years for filtering
 * @param props.filterValues - Current active filter values
 * @param props.values - All review values for calculating counts
 * @returns Filter input components for reviews
 */
export function ReviewsFilters({
  dispatch,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<ReviewsAction>;
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  filterValues: ReviewsFiltersValues;
  values: ReviewsValue[];
}): React.JSX.Element {
  const genreCounts = calculateGenreCounts(values, filterValues);

  return (
    <>
      <TextField
        defaultValue={filterValues.title}
        label="Title"
        onInputChange={(value) => dispatch(createTitleFilterChangedAction(value))}
        placeholder="Enter all or part of a title"
      />
      <YearField
        defaultValues={filterValues.releaseYear}
        label="Release Year"
        onClear={() => dispatch(createRemoveAppliedFilterAction("releaseYear"))}
        onYearChange={(values) =>
          dispatch(createReleaseYearFilterChangedAction(values))
        }
        years={distinctReleaseYears}
      />
      <AnimatedDetailsDisclosure title="Genres">
        <CheckboxListField
          defaultValues={filterValues.genres}
          label="Genres"
          onChange={(values) => dispatch(createGenresFilterChangedAction(values))}
          onClear={() => dispatch(createRemoveAppliedFilterAction("genres"))}
          options={distinctGenres.map((value) => ({
            count: genreCounts.get(value) ?? 0,
            label: value,
            value,
          }))}
        />
      </AnimatedDetailsDisclosure>
      <GradeField
        defaultValues={filterValues.gradeValue}
        label="Grade"
        onClear={() => dispatch(createRemoveAppliedFilterAction("gradeValue"))}
        onGradeChange={(values) => dispatch(createGradeFilterChangedAction(values))}
      />
      <YearField
        defaultValues={filterValues.reviewYear}
        label="Review Year"
        onClear={() => dispatch(createRemoveAppliedFilterAction("reviewYear"))}
        onYearChange={(values) =>
          dispatch(createReviewYearFilterChangedAction(values))
        }
        years={distinctReviewYears}
      />
    </>
  );
}

/**
 * Sort options for the reviews page.
 */

export { REVIEWED_TITLE_SORT_OPTIONS as SORT_OPTIONS } from "~/components/filter-and-sort/ReviewedTitleSortOptions";
