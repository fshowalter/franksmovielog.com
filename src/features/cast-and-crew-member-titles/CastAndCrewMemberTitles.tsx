import { useReducer } from "react";

import type { StillImageProps } from "~/api/stills";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { ReviewedTitleSortOptions } from "~/components/filter-and-sort/ReviewedTitleSortOptions";
import { ListItemWatchlistReason } from "~/components/list-item-watchlist-reason/ListItemWatchlistReason";
import { PlaceholderCard } from "~/components/placeholder-card/PlaceholderCard";
import { GroupedReviewCardList } from "~/components/review-card-list/GroupedReviewCardList";
import { ReviewCardListImageConfig } from "~/components/review-card-list/ReviewCardList";
import { ReviewCard } from "~/components/review-card/ReviewCard";
import { useGroupedValues } from "~/hooks/useGroupedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { CastAndCrewMemberTitlesSort } from "./sortCastAndCrewMemberTitles";

import {
  createApplyFiltersAction,
  createClearFiltersAction,
  createInitialState,
  createResetFiltersAction,
  createSortAction,
  reducer,
  selectHasPendingFilters,
} from "./CastAndCrewMemberTitles.reducer";
import { CastAndCrewMemberTitlesFilters } from "./CastAndCrewMemberTitlesFilters";
import { CastAndCrewMemberTitlesSubNav } from "./CastAndCrewMemberTitlesSubNav";
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
  excerpt: string | undefined;
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

  const [groupedValues, totalCount] = useGroupedValues(
    sortCastAndCrewMemberTitles,
    filterCastAndCrewMemberTitles,
    groupCastAndCrewMemberTitles,
    state.values,
    state.sort,
    state.activeFilterValues,
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
      subNav={
        <CastAndCrewMemberTitlesSubNav
          groupedValues={groupedValues}
          sortValue={state.sort}
        />
      }
      totalCount={totalCount}
    >
      <GroupedReviewCardList
        groupedValues={groupedValues}
        groupItemClassName={`scroll-mt-[var(--filter-and-sort-container-scroll-offset)] tablet:scroll-mt-[calc(24px_+_var(--filter-and-sort-container-scroll-offset,0px))]`}
      >
        {(value) => {
          if (value.slug && value.grade && value.excerpt) {
            return (
              <ReviewCard
                as="li"
                excerpt={value.excerpt}
                eyebrow={value.creditedAs.join(", ")}
                footer={
                  <>
                    {value.reviewDisplayDate}
                    <span className={`font-light opacity-50`}> — </span>
                    {value.genres.join(", ")}
                  </>
                }
                grade={value.grade}
                key={value.imdbId}
                releaseYear={value.releaseYear}
                slug={value.slug}
                stillImageConfig={ReviewCardListImageConfig}
                stillImageProps={value.stillImageProps}
                title={value.title}
              />
            );
          }
          return (
            <PlaceholderCard
              as="li"
              bodyText={
                <ListItemWatchlistReason
                  collectionNames={value.watchlistCollectionNames}
                  directorNames={value.watchlistDirectorNames}
                  performerNames={value.watchlistPerformerNames}
                  writerNames={value.watchlistWriterNames}
                />
              }
              eyebrow={value.creditedAs.join(", ")}
              footer={value.genres.join(", ")}
              key={value.imdbId}
              releaseYear={value.releaseYear}
              stillImageConfig={ReviewCardListImageConfig}
              stillImageProps={value.stillImageProps}
              title={value.title}
            />
          );
        }}
      </GroupedReviewCardList>
    </FilterAndSortContainer>
  );
}
