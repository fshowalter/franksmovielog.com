import type { CheckboxListFieldOption } from "~/components/fields/CheckboxListField";

import { AnimatedDetailsDisclosure } from "~/components/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/fields/CheckboxListField";
import { GradeField } from "~/components/fields/GradeField";
import { TextField } from "~/components/fields/TextField";
import { YearField } from "~/components/fields/YearField";
import { capitalize } from "~/utils/capitalize";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type {
  CastAndCrewMemberTitlesAction,
  CastAndCrewMemberTitlesFiltersValues,
} from "./CastAndCrewMemberTitles.reducer";

import {
  createCreditedAsFilterChangedAction,
  createGenresFilterChangedAction,
  createGradeFilterChangedAction,
  createReleaseYearFilterChangedAction,
  createRemoveAppliedFilterAction,
  createReviewedStatusFilterChangedAction,
  createReviewYearFilterChangedAction,
  createTitleFilterChangedAction,
} from "./CastAndCrewMemberTitles.reducer";
import {
  calculateCreditedAsCounts,
  calculateGenreCounts,
  calculateReviewedStatusCounts,
} from "./filterCastAndCrewMemberTitles";

/**
 * Filter controls for cast and crew member titles page.
 * @param props - Component props
 * @param props.dispatch - Reducer dispatch function for filter actions
 * @param props.distinctCreditKinds - Available credit types for filtering
 * @param props.distinctGenres - Available genres for filtering
 * @param props.distinctReleaseYears - Available release years for filtering
 * @param props.distinctReviewYears - Available review years for filtering
 * @param props.filterValues - Current active filter values
 * @param props.values - All cast and crew member title values for count calculation
 * @returns Filter input components for cast and crew member titles
 */
export function CastAndCrewMemberTitlesFilters({
  dispatch,
  distinctCreditKinds,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<CastAndCrewMemberTitlesAction>;
  distinctCreditKinds: readonly string[];
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  filterValues: CastAndCrewMemberTitlesFiltersValues;
  values: CastAndCrewMemberTitlesValue[];
}): React.JSX.Element {
  // Calculate genre counts based on current filters
  const genreCounts = calculateGenreCounts(values, filterValues);

  // Calculate reviewed status counts dynamically
  const reviewedStatusCounts = calculateReviewedStatusCounts(
    values,
    filterValues,
  );

  // Calculate credited as counts dynamically
  const creditedAsCounts = calculateCreditedAsCounts(values, filterValues);

  const reviewedStatusOptions: CheckboxListFieldOption[] = [
    {
      count: reviewedStatusCounts.get("Reviewed") ?? 0,
      label: "Reviewed",
      value: "Reviewed",
    },
    {
      count: reviewedStatusCounts.get("Not Reviewed") ?? 0,
      label: "Not Reviewed",
      value: "Not Reviewed",
    },
  ];

  return (
    <>
      {distinctCreditKinds.length > 1 && (
        <AnimatedDetailsDisclosure title="Credited As">
          <CheckboxListField
            defaultValues={filterValues.creditedAs ?? []}
            label="Credited As"
            onChange={(values) =>
              dispatch(createCreditedAsFilterChangedAction(values))
            }
            onClear={() =>
              dispatch(createRemoveAppliedFilterAction("creditedAs"))
            }
            options={distinctCreditKinds.map((credit) => ({
              count: creditedAsCounts.get(credit) ?? 0,
              label: capitalize(credit),
              value: credit,
            }))}
          />
        </AnimatedDetailsDisclosure>
      )}
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
