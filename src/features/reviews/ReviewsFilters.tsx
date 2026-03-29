import { GenresFacet } from "~/components/filter-and-sort/facets/genres/GenresFacet";
import { GradeFacet } from "~/components/filter-and-sort/facets/grade/GradeFacet";
import { ReleaseYearFacet } from "~/components/filter-and-sort/facets/release-year/ReleaseYearFacet";
import { ReviewYearFacet } from "~/components/filter-and-sort/facets/review-year/ReviewYearFacet";
import { TitleFacet } from "~/components/filter-and-sort/facets/title/TitleFacet";

import type { ReviewsAction, ReviewsFiltersValues } from "./reducer";
import type { ReviewsValue } from "./ReviewsListItem";

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
  return (
    <>
      <TitleFacet defaultValue={filterValues.title} dispatch={dispatch} />
      <ReleaseYearFacet
        defaultValues={filterValues.releaseYear}
        dispatch={dispatch}
        distinctYears={distinctReleaseYears}
      />
      <GenresFacet
        defaultValues={filterValues.genres}
        dispatch={dispatch}
        distinctGenres={distinctGenres}
        values={values}
      />
      <GradeFacet defaultValues={filterValues.gradeValue} dispatch={dispatch} />
      <ReviewYearFacet
        defaultValues={filterValues.reviewYear}
        dispatch={dispatch}
        distinctYears={distinctReviewYears}
      />
    </>
  );
}

/**
 * Sort options for the reviews page.
 */

export { REVIEWED_TITLE_SORT_OPTIONS as SORT_OPTIONS } from "~/components/filter-and-sort/ReviewedTitleSortOptions";
