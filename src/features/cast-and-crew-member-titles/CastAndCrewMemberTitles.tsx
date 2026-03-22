import { useReducer } from "react";

import type { PosterImageProps } from "~/assets/posters";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { REVIEWED_TITLE_SORT_OPTIONS } from "~/components/filter-and-sort/ReviewedTitleSortOptions";
import { PosterList } from "~/components/poster-list/PosterList";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { CastAndCrewMemberTitlesSort } from "./sortCastAndCrewMemberTitles";

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
} from "./CastAndCrewMemberTitles.reducer";
import { CastAndCrewMemberTitlesFilters } from "./CastAndCrewMemberTitlesFilters";
import { CastAndCrewMemberTitlesListItem } from "./CastAndCrewMemberTitlesListItem";
import { filterCastAndCrewMemberTitles } from "./filterCastAndCrewMemberTitles";
import { sortCastAndCrewMemberTitles } from "./sortCastAndCrewMemberTitles";

/**
 * Props for the CastAndCrewMemberTitles component.
 */
export type CastAndCrewMemberTitlesProps = {
  distinctCreditKinds: readonly string[];
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: CastAndCrewMemberTitlesSort;
  values: CastAndCrewMemberTitlesValue[];
};

/**
 * Data structure for cast and crew member title values.
 */
export type CastAndCrewMemberTitlesValue = {
  creditedAs: string[];
  genres: string[];
  grade: string | undefined;
  gradeValue: number | undefined;
  imdbId: string;
  posterImageProps: PosterImageProps;
  releaseSequence: number;
  releaseYear: string;
  reviewDisplayDate: string | undefined;
  reviewSequence: string | undefined;
  reviewSlug: string | undefined;
  reviewYear: string | undefined;
  sortTitle: string;
  title: string;
  watchlistCollectionNames: string[];
  watchlistDirectorNames: string[];
  watchlistPerformerNames: string[];
  watchlistWriterNames: string[];
};

/**
 * Component for displaying titles associated with a cast or crew member.
 * @param props - Component props
 * @returns Filtered and sorted list of member titles
 */
export function CastAndCrewMemberTitles({
  distinctCreditKinds,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  initialSort,
  values,
}: CastAndCrewMemberTitlesProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values: [...values],
    },
    createInitialState,
  );

  const sortedValues = sortCastAndCrewMemberTitles(state.values, state.sort);
  const filteredValues = filterCastAndCrewMemberTitles(
    sortedValues,
    state.activeFilterValues,
  );

  const pendingFilteredCount = usePendingFilterCount(
    filterCastAndCrewMemberTitles,
    state.values,
    state.pendingFilterValues,
  );

  const hasPendingFilters = selectHasPendingFilters(state);

  // AIDEV-NOTE: Applied filters only show after clicking "View X results" to avoid layout shift
  return (
    <FilterAndSortContainer
      activeFilters={buildAppliedFilterChips(state.activeFilterValues, {
        distinctReleaseYears,
        distinctReviewYears,
      })}
      filters={
        <CastAndCrewMemberTitlesFilters
          dispatch={dispatch}
          distinctCreditKinds={distinctCreditKinds}
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
      <div className="tablet:-mx-6 tablet:pt-10">
        <PosterList>
          {[...filteredValues].map((value) => {
            return (
              <CastAndCrewMemberTitlesListItem
                key={value.imdbId}
                value={value}
              />
            );
          })}
        </PosterList>
      </div>
    </FilterAndSortContainer>
  );
}
