import type { CheckboxListFieldOption } from "~/components/fields/CheckboxListField";

import { AnimatedDetailsDisclosure } from "~/components/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/fields/CheckboxListField";
import { GradeField } from "~/components/fields/GradeField";
import { TextField } from "~/components/fields/TextField";
import { YearField } from "~/components/fields/YearField";

import type { CollectionTitlesValue } from "./CollectionTitles";
import type {
  CollectionTitlesAction,
  CollectionTitlesFiltersValues,
} from "./CollectionTitles.reducer";

import {
  createGenresFilterChangedAction,
  createGradeFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createRemoveAppliedFilterAction,
  createReviewedStatusFilterChangedAction,
  createReviewYearFilterChangedAction,
  createTitleFilterChangedAction,
} from "./CollectionTitles.reducer";
import {
  calculateGenreCounts,
  calculateReviewedStatusCounts,
} from "./filterCollectionTitles";

/**
 * Filter controls for the collection titles page.
 * @param props - Component props
 * @param props.dispatch - Reducer dispatch function for filter actions
 * @param props.distinctGenres - Available genres for filtering
 * @param props.distinctReleaseYears - Available release years for filtering
 * @param props.distinctReviewYears - Available review years for filtering
 * @param props.filterValues - Current active filter values
 * @param props.values - All collection title values (for calculating counts)
 * @returns Filter input components for collection titles
 */
export function CollectionTitlesFilters({
  dispatch,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<CollectionTitlesAction>;
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  filterValues: CollectionTitlesFiltersValues;
  values?: CollectionTitlesValue[];
}): React.JSX.Element {
  // Calculate genre counts dynamically (respects all non-genre filters)
  const genreCounts = values
    ? calculateGenreCounts(values, filterValues)
    : undefined;

  // Calculate reviewed status counts dynamically
  const reviewedStatusCounts = values
    ? calculateReviewedStatusCounts(values, filterValues)
    : undefined;

  const reviewedStatusOptions: CheckboxListFieldOption[] = [
    {
      count: reviewedStatusCounts?.get("Reviewed") ?? 0,
      label: "Reviewed",
      value: "Reviewed",
    },
    {
      count: reviewedStatusCounts?.get("Not Reviewed") ?? 0,
      label: "Not Reviewed",
      value: "Not Reviewed",
    },
  ];

  return (
    <>
      <TextField
        defaultValue={filterValues.title}
        label="Title"
        onInputChange={(value) =>
          dispatch(createTitleFilterChangedAction(value))
        }
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
          onChange={(values) =>
            dispatch(createGenresFilterChangedAction(values))
          }
          onClear={() => dispatch(createRemoveAppliedFilterAction("genres"))}
          options={distinctGenres.map((value) => ({
            count: genreCounts?.get(value) ?? 0,
            label: value,
            value,
          }))}
        />
      </AnimatedDetailsDisclosure>
      <GradeField
        defaultValues={filterValues.gradeValue}
        label="Grade"
        onClear={() => dispatch(createRemoveAppliedFilterAction("gradeValue"))}
        onGradeChange={(values) =>
          dispatch(createGradeFilterChangedAction(values))
        }
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
      <AnimatedDetailsDisclosure title="Reviewed Status">
        <CheckboxListField
          defaultValues={filterValues.reviewedStatus ?? []}
          label="Reviewed Status"
          onChange={(values) =>
            dispatch(createReviewedStatusFilterChangedAction(values))
          }
          onClear={() =>
            dispatch(createRemoveAppliedFilterAction("reviewedStatus"))
          }
          options={reviewedStatusOptions}
        />
      </AnimatedDetailsDisclosure>
    </>
  );
}
