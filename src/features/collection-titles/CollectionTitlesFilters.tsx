import { GenresFacet } from "~/components/filter-and-sort/facets/genres/GenresFacet";
import { GradeFacet } from "~/components/filter-and-sort/facets/grade/GradeFacet";
import { ReleaseYearFacet } from "~/components/filter-and-sort/facets/release-year/ReleaseYearFacet";
import { ReviewYearFacet } from "~/components/filter-and-sort/facets/review-year/ReviewYearFacet";
import { ReviewedStatusFacet } from "~/components/filter-and-sort/facets/reviewed-status/ReviewedStatusFacet";
import { TitleFacet } from "~/components/filter-and-sort/facets/title/TitleFacet";

import type { CollectionTitlesValue } from "./CollectionTitles";
import type {
  CollectionTitlesAction,
  CollectionTitlesFiltersValues,
} from "./CollectionTitles.reducer";

import { filterCollectionTitles } from "./filterCollectionTitles";

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
  values: CollectionTitlesValue[];
}): React.JSX.Element {
  return (
    <>
      <TitleFacet defaultValue={filterValues.title} dispatch={dispatch} />
      <ReleaseYearFacet
        dispatch={dispatch}
        distinctYears={distinctReleaseYears}
        selectedValues={filterValues.releaseYear}
      />
      <GenresFacet
        dispatch={dispatch}
        distinctGenres={distinctGenres}
        filterer={filterCollectionTitles}
        filterValues={filterValues}
        values={values}
      />
      <GradeFacet
        dispatch={dispatch}
        selectedValues={filterValues.gradeValue}
      />
      <ReviewYearFacet
        dispatch={dispatch}
        distinctYears={distinctReviewYears}
        selectedValues={filterValues.reviewYear}
      />
      <ReviewedStatusFacet
        dispatch={dispatch}
        filterer={filterCollectionTitles}
        filterValues={filterValues}
        values={values}
      />
    </>
  );
}
