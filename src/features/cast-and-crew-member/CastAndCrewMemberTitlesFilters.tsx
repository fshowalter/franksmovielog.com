import { CreditedAsFacet } from "~/components/filter-and-sort/facets/credited-as/CreditedAsFacet";
import { GenresFacet } from "~/components/filter-and-sort/facets/genres/GenresFacet";
import { GradeFacet } from "~/components/filter-and-sort/facets/grade/GradeFacet";
import { ReleaseYearFacet } from "~/components/filter-and-sort/facets/release-year/ReleaseYearFacet";
import { ReviewYearFacet } from "~/components/filter-and-sort/facets/review-year/ReviewYearFacet";
import { ReviewedStatusFacet } from "~/components/filter-and-sort/facets/reviewed-status/ReviewedStatusFacet";
import { TitleFacet } from "~/components/filter-and-sort/facets/title/TitleFacet";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";
import type {
  CastAndCrewMemberTitlesAction,
  CastAndCrewMemberTitlesFiltersValues,
} from "./castAndCrewMemberTitlesReducer";

import { filterCastAndCrewMemberTitles } from "./filterCastAndCrewMemberTitles";

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
  return (
    <>
      <CreditedAsFacet
        dispatch={dispatch}
        distinctCreditKinds={distinctCreditKinds}
        filterer={filterCastAndCrewMemberTitles}
        filterValues={filterValues}
        values={values}
      />
      <TitleFacet defaultValue={filterValues.title} dispatch={dispatch} />
      <ReleaseYearFacet
        defaultValues={filterValues.releaseYear}
        dispatch={dispatch}
        distinctYears={distinctReleaseYears}
      />
      <GenresFacet
        dispatch={dispatch}
        distinctGenres={distinctGenres}
        filterer={filterCastAndCrewMemberTitles}
        filterValues={filterValues}
        values={values}
      />
      <GradeFacet defaultValues={filterValues.gradeValue} dispatch={dispatch} />
      <ReviewYearFacet
        defaultValues={filterValues.reviewYear}
        dispatch={dispatch}
        distinctYears={distinctReviewYears}
      />
      <ReviewedStatusFacet
        dispatch={dispatch}
        filterer={filterCastAndCrewMemberTitles}
        filterValues={filterValues}
        values={values}
      />
    </>
  );
}
