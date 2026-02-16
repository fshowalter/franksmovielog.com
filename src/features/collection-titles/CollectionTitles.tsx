import { useReducer } from "react";

import type { PosterImageProps } from "~/api/posters";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { REVIEWED_TITLE_SORT_OPTIONS } from "~/components/filter-and-sort/ReviewedTitleSortOptions";
import { PosterList } from "~/components/poster-list/PosterList";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { CollectionTitlesSort } from "./sortCollectionTitles";

import { buildAppliedFilterChips } from "./appliedFilterChips";
import {
  createApplyFiltersAction,
  createClearFiltersAction,
  createInitialState,
  createRemoveAppliedFilterAction,
  createResetFiltersAction,
  createSortAction,
  reducer,
  selectHasPendingFilters,
} from "./CollectionTitles.reducer";
import { CollectionTitlesFilters } from "./CollectionTitlesFilters";
import { CollectionTitlesListItem } from "./CollectionTitlesListItem";
import { filterCollectionTitles } from "./filterCollectionTitles";
import { sortCollectionTitles } from "./sortCollectionTitles";

/**
 * Props for the CollectionTitles component.
 */
export type CollectionTitlesProps = {
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: CollectionTitlesSort;
  values: CollectionTitlesValue[];
};

/**
 * Value object for a title in a collection.
 */
export type CollectionTitlesValue = {
  genres: string[];
  grade?: string;
  gradeValue?: number;
  imdbId: string;
  posterImageProps: PosterImageProps;
  releaseSequence: number;
  releaseYear: string;
  reviewDisplayDate: string;
  reviewSequence?: number;
  reviewYear?: string;
  slug?: string;
  sortTitle: string;
  title: string;
};

/**
 * CollectionTitles component for displaying titles in a collection.
 * @param props - Component props
 * @param props.distinctGenres - Available genres for filtering
 * @param props.distinctReleaseYears - Available release years for filtering
 * @param props.distinctReviewYears - Available review years for filtering
 * @param props.initialSort - Initial sort configuration
 * @param props.values - Title values to display
 * @returns CollectionTitles component with filtering and sorting capabilities
 */
export function CollectionTitles({
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  initialSort,
  values,
}: CollectionTitlesProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values: [...values],
    },
    createInitialState,
  );

  const sortedValues = sortCollectionTitles(state.values, state.sort);

  const filteredValues = filterCollectionTitles(
    sortedValues,
    state.activeFilterValues,
  );

  const pendingFilteredCount = usePendingFilterCount(
    filterCollectionTitles,
    state.values,
    state.pendingFilterValues,
  );

  const hasPendingFilters = selectHasPendingFilters(state);

  // AIDEV-NOTE: Applied filters only show after clicking "View X results" to avoid layout shift
  const activeFilters = buildAppliedFilterChips(state.activeFilterValues, {
    distinctReleaseYears,
    distinctReviewYears,
  });

  return (
    <FilterAndSortContainer
      activeFilters={activeFilters}
      filters={
        <CollectionTitlesFilters
          dispatch={dispatch}
          distinctGenres={distinctGenres}
          distinctReleaseYears={distinctReleaseYears}
          distinctReviewYears={distinctReviewYears}
          filterValues={state.pendingFilterValues}
          values={values}
        />
      }
      hasPendingFilters={hasPendingFilters}
      onApplyFilters={() => dispatch(createApplyFiltersAction())}
      onClearFilters={() => {
        dispatch(createClearFiltersAction());
      }}
      onFilterDrawerOpen={() => dispatch(createResetFiltersAction())}
      onRemoveFilter={(filterId) =>
        dispatch(createRemoveAppliedFilterAction(filterId))
      }
      onResetFilters={() => {
        dispatch(createResetFiltersAction());
      }}
      pendingFilteredCount={pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sort,
        onSortChange: (value) => dispatch(createSortAction(value)),
        sortOptions: REVIEWED_TITLE_SORT_OPTIONS,
      }}
      totalCount={filteredValues.length}
    >
      <div className="tablet:pt-10">
        <PosterList>
          {[...filteredValues].map((value) => {
            return (
              <CollectionTitlesListItem key={value.imdbId} value={value} />
            );
          })}
        </PosterList>
      </div>
    </FilterAndSortContainer>
  );
}
