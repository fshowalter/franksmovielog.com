import { useReducer } from "react";

import type { PosterImageProps } from "~/assets/posters";
import type { GradeText, GradeValue } from "~/utils/grades";

import { FilterAndSortContainer } from "~/components/filter-and-sort/container/FilterAndSortContainer";
import { PaginatedList } from "~/components/filter-and-sort/paginated-list/PaginatedList";
import { PosterList } from "~/components/poster-list/PosterList";
import { usePaginatedValues } from "~/hooks/usePaginatedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { CastAndCrewMemberTitlesSort } from "./sortCastAndCrewMemberTitles";

import { buildAppliedFilterChips } from "./buildAppliedFilterChips";
import { CastAndCrewMemberTitlesFilters } from "./CastAndCrewMemberTitlesFilters";
import { CastAndCrewMemberTitlesListItem } from "./CastAndCrewMemberTitlesListItem";
import { createInitialState, reducer } from "./castAndCrewMemberTitlesReducer";
import { filterCastAndCrewMemberTitles } from "./filterCastAndCrewMemberTitles";
import {
  sortCastAndCrewMemberTitles,
  sortOptions,
} from "./sortCastAndCrewMemberTitles";

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
  grade: GradeText | undefined;
  gradeValue: GradeValue | undefined;
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

  const [paginatedValues, totalCount] = usePaginatedValues(
    sortCastAndCrewMemberTitles,
    filterCastAndCrewMemberTitles,
    state.values,
    state.sort,
    state.activeFilterValues,
    state.showCount,
  );

  const pendingFilteredCount = usePendingFilterCount(
    filterCastAndCrewMemberTitles,
    state.values,
    state.pendingFilterValues,
  );

  // AIDEV-NOTE: Applied filters only show after clicking "View X results" to avoid layout shift
  return (
    <FilterAndSortContainer
      activeFilters={buildAppliedFilterChips(state.activeFilterValues)}
      dispatch={dispatch}
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
      pendingFilteredCount={pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sort,
        sortOptions,
      }}
      state={state}
      totalCount={totalCount}
    >
      <PaginatedList
        dispatch={dispatch}
        totalCount={totalCount}
        visibleCount={state.showCount}
      >
        <PosterList>
          {[...paginatedValues].map((value) => {
            return (
              <CastAndCrewMemberTitlesListItem
                key={value.imdbId}
                value={value}
              />
            );
          })}
        </PosterList>
      </PaginatedList>
    </FilterAndSortContainer>
  );
}
