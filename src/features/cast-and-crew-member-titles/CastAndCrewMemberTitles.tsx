import { useReducer } from "react";

import type { StillImageProps } from "~/api/stills";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { ReviewedTitleSortOptions } from "~/components/filter-and-sort/ReviewedTitleSortOptions";
import { ListItemWatchlistReason } from "~/components/list-item-watchlist-reason/ListItemWatchlistReason";
import { GroupedReviewCardList } from "~/components/review-card-list/GroupedReviewCardList";
import { ReviewCardListImageConfig } from "~/components/review-card-list/ReviewCardList";
import { CardContent } from "~/components/review-card/CardContent";
import { CardExcerpt } from "~/components/review-card/CardExcerpt";
import { CardEyebrow } from "~/components/review-card/CardEyebrow";
import { CardFooter } from "~/components/review-card/CardFooter";
import { CardGrade } from "~/components/review-card/CardGrade";
import { CardMobilePadding } from "~/components/review-card/CardMobilePadding";
import { CardStill } from "~/components/review-card/CardStill";
import { CardTitle } from "~/components/review-card/CardTitle";
import { CardTitleLink } from "~/components/review-card/CardTitleLink";
import { PlaceholderCardContainer } from "~/components/review-card/PlaceholderCardContainer";
import { ReviewCardContainer } from "~/components/review-card/ReviewCardContainer";
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
import { SubNav } from "./SubNav";

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
      className="[--scroll-offset:52px]"
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
      topNav={<SubNav groupedValues={groupedValues} sortValue={state.sort} />}
      totalCount={totalCount}
    >
      <GroupedReviewCardList
        groupedValues={groupedValues}
        groupItemClassName={`scroll-mt-[calc(52px_+_var(--filter-and-sort-container-scroll-offset))]`}
        onShowMore={() => dispatch(createShowMoreAction())}
        totalCount={totalCount}
        visibleCount={state.showCount}
      >
        {(value) => {
          if (value.slug && value.grade) {
            return (
              <ReviewCardContainer as="li" key={value.imdbId}>
                <CardMobilePadding>
                  <CardStill
                    imageConfig={ReviewCardListImageConfig}
                    imageProps={value.stillImageProps}
                  />
                  <CardContent>
                    <CardEyebrow>{value.creditedAs.join(", ")}</CardEyebrow>
                    <CardTitleLink
                      releaseYear={value.releaseYear}
                      slug={value.slug}
                      title={value.title}
                    />
                    <CardGrade grade={value.grade} />
                    <CardExcerpt
                      dateLine={value.reviewDisplayDate}
                      excerpt={value.excerpt}
                    />
                    <CardFooter>
                      {value.genres.join(", ")}
                      <span className={`font-light opacity-50`}>&mdash;</span>
                      {value.reviewDisplayDate}
                    </CardFooter>
                  </CardContent>
                </CardMobilePadding>
              </ReviewCardContainer>
            );
          }
          return (
            <PlaceholderCardContainer as="li" key={value.imdbId}>
              <CardMobilePadding>
                <CardStill
                  imageConfig={ReviewCardListImageConfig}
                  imageProps={value.stillImageProps}
                />
                <CardContent>
                  <CardEyebrow>{value.creditedAs.join(", ")}</CardEyebrow>
                  <div className="mb-3">
                    <CardTitle
                      releaseYear={value.releaseYear}
                      textColorClassNames="text-subtle"
                      title={value.title}
                    />
                  </div>
                  <div className="mt-1 mb-9">
                    <ListItemWatchlistReason
                      collectionNames={value.watchlistCollectionNames}
                      directorNames={value.watchlistDirectorNames}
                      performerNames={value.watchlistPerformerNames}
                      writerNames={value.watchlistWriterNames}
                    />
                  </div>
                  <CardFooter>{value.genres.join(", ")}</CardFooter>
                </CardContent>
              </CardMobilePadding>
            </PlaceholderCardContainer>
          );
        }}
      </GroupedReviewCardList>
    </FilterAndSortContainer>
  );
}
