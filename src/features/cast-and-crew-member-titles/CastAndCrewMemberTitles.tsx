import { useReducer } from "react";

import type { StillImageProps } from "~/api/stills";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { ReviewedTitleSortOptions } from "~/components/filter-and-sort/ReviewedTitleSortOptions";
import { GroupedReviewCardList } from "~/components/review-card-list/GroupedReviewCardList";
import { PlaceholderCard } from "~/components/review-card-list/PlaceholderCard";
import { ReviewCardListImageConfig } from "~/components/review-card-list/ReviewCardList";
import { ReviewCard } from "~/components/review-card/ReviewCard";
import { usePaginatedGroupedValues } from "~/hooks/usePaginatedGroupedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { CastAndCrewMemberTitlesSort } from "./sortCastAndCrewMemberTitles";

import {
  createApplyFiltersAction,
  createClearFiltersAction,
  createInitialState,
  createResetFiltersAction,
  createShowMoreAction,
  createSortAction,
  reducer,
  selectHasPendingFilters,
} from "./CastAndCrewMemberTitles.reducer";
import { CastAndCrewMemberTitlesFilters } from "./CastAndCrewMemberTitlesFilters";
import { filterCastAndCrewMemberTitles } from "./filterCastAndCrewMemberTitles";
import { groupCastAndCrewMemberTitles } from "./groupCastAndCrewMemberTitles";
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
  excerpt: string;
  genres: string[];
  grade?: string;
  gradeValue?: number;
  imdbId: string;
  releaseSequence: number;
  releaseYear: string;
  reviewDisplayDate?: string;
  reviewSequence?: number;
  reviewYear?: string;
  slug?: string;
  sortTitle: string;
  stillImageProps: StillImageProps;
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

  const [groupedValues, totalCount] = usePaginatedGroupedValues(
    sortCastAndCrewMemberTitles,
    filterCastAndCrewMemberTitles,
    groupCastAndCrewMemberTitles,
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

  const hasPendingFilters = selectHasPendingFilters(state);

  return (
    <FilterAndSortContainer
      filters={
        <CastAndCrewMemberTitlesFilters
          dispatch={dispatch}
          distinctCreditKinds={distinctCreditKinds}
          distinctGenres={distinctGenres}
          distinctReleaseYears={distinctReleaseYears}
          distinctReviewYears={distinctReviewYears}
          filterValues={state.pendingFilterValues}
        />
      }
      hasPendingFilters={hasPendingFilters}
      onApplyFilters={() => dispatch(createApplyFiltersAction())}
      onClearFilters={() => {
        dispatch(createClearFiltersAction());
      }}
      onFilterDrawerOpen={() => dispatch(createResetFiltersAction())}
      onResetFilters={() => {
        dispatch(createResetFiltersAction());
      }}
      pendingFilteredCount={pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sort,
        onSortChange: (e) =>
          dispatch(
            createSortAction(e.target.value as CastAndCrewMemberTitlesSort),
          ),
        sortOptions: <ReviewedTitleSortOptions />,
      }}
      totalCount={totalCount}
    >
      <GroupedReviewCardList
        groupedValues={groupedValues}
        onShowMore={() => dispatch(createShowMoreAction())}
        totalCount={totalCount}
        visibleCount={state.showCount}
      >
        {(value) => {
          if (value.slug && value.grade) {
            return (
              <ReviewCard
                as="li"
                imageConfig={ReviewCardListImageConfig}
                key={value.imdbId}
                value={value}
              />
            );
          }
          return (
            <PlaceholderCard
              as="li"
              imageConfig={ReviewCardListImageConfig}
              key={value.imdbId}
              value={value}
            />
          );
        }}
      </GroupedReviewCardList>
    </FilterAndSortContainer>
  );
}
