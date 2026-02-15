import { useReducer } from "react";

import type { StillImageProps } from "~/api/stills";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { ReviewedTitleSortOptions } from "~/components/filter-and-sort/ReviewedTitleSortOptions";
import { ListItemWatchlistReason } from "~/components/list-item-watchlist-reason/ListItemWatchlistReason";
import { PlaceholderCard } from "~/components/placeholder-card/PlaceholderCard";
import {
  ReviewCardList,
  ReviewCardListImageConfig,
} from "~/components/review-card-list/ReviewCardList";
import { ReviewCard } from "~/components/review-card/ReviewCard";
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
        onSortChange: (e) =>
          dispatch(
            createSortAction(e.target.value as CastAndCrewMemberTitlesSort),
          ),
        sortOptions: <ReviewedTitleSortOptions />,
      }}
      totalCount={filteredValues.length}
    >
      <div
        className="
          tablet:pt-10
          laptop:pt-14
        "
      >
        <ReviewCardList>
          {[...filteredValues].map((value) => {
            if (value.slug && value.grade && value.excerpt) {
              return (
                <ReviewCard
                  as="li"
                  excerpt={value.excerpt}
                  eyebrow={value.creditedAs.join(", ")}
                  footer={
                    <>
                      <div className="mb-2 text-accent">
                        {value.reviewDisplayDate}
                      </div>
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
          })}
        </ReviewCardList>
      </div>
    </FilterAndSortContainer>
  );
}
