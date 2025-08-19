import type { JSX } from "react";

import { useReducer, useState } from "react";

import type { CastAndCrewMember } from "~/api/castAndCrew";
import type { PosterImageProps } from "~/api/posters";

import { CreditedAs } from "~/components/CreditedAs";
import { ListItemDetails } from "~/components/ListItemDetails";
import { ListItemGenres } from "~/components/ListItemGenres";
import { ListItemGrade } from "~/components/ListItemGrade";
import { ListItemReviewDate } from "~/components/ListItemReviewDate";
import { ListItemTitle } from "~/components/ListItemTitle";
import { ListWithFilters } from "~/components/ListWithFilters";
import { GroupedPosterList, PosterListItem } from "~/components/PosterList";
import { WatchlistTitleSlug } from "~/components/WatchlistTitleSlug";

import type { Sort } from "./CastAndCrewMember.reducer";

import { Actions, initState, reducer } from "./CastAndCrewMember.reducer";
import { Filters, SortOptions } from "./Filters";

export type ListItemValue = Pick<
  CastAndCrewMember["titles"][0],
  | "creditedAs"
  | "genres"
  | "grade"
  | "gradeValue"
  | "imdbId"
  | "releaseSequence"
  | "releaseYear"
  | "slug"
  | "sortTitle"
  | "title"
  | "watchlistCollectionNames"
  | "watchlistDirectorNames"
  | "watchlistPerformerNames"
  | "watchlistWriterNames"
> & {
  posterImageProps: PosterImageProps;
  reviewDisplayDate: string;
  reviewSequence?: string;
  reviewYear: string;
};

export type Props = {
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: Sort;
  titles: ListItemValue[];
  value: Pick<
    CastAndCrewMember,
    "creditedAs" | "name" | "reviewCount" | "titleCount"
  >;
};

export function CastAndCrewMember({
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  initialSort,
  titles,
  value,
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values: [...titles],
    },
    initState,
  );
  const [filterKey, setFilterKey] = useState(0);

  return (
    <ListWithFilters
      filters={
        <Filters
          creditedAs={value.creditedAs}
          dispatch={dispatch}
          distinctGenres={distinctGenres}
          distinctReleaseYears={distinctReleaseYears}
          distinctReviewYears={distinctReviewYears}
          filterValues={state.pendingFilterValues}
          hideReviewed={state.hideReviewed}
          key={filterKey}
        />
      }
      hasActiveFilters={state.hasActiveFilters}
      list={
        <GroupedPosterList
          groupedValues={state.groupedValues}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
          totalCount={state.filteredValues.length}
          visibleCount={state.showCount!}
        >
          {(value) => {
            return <TitleListItem key={value.imdbId} value={value} />;
          }}
        </GroupedPosterList>
      }
      onApplyFilters={() => dispatch({ type: Actions.APPLY_PENDING_FILTERS })}
      onClearFilters={() => {
        dispatch({ type: Actions.CLEAR_PENDING_FILTERS });
        setFilterKey((k) => k + 1);
      }}
      onFilterDrawerOpen={() =>
        dispatch({ type: Actions.RESET_PENDING_FILTERS })
      }
      onResetFilters={() => {
        dispatch({ type: Actions.RESET_PENDING_FILTERS });
        setFilterKey((k) => k + 1);
      }}
      pendingFilteredCount={state.pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sortValue,
        onSortChange: (e) =>
          dispatch({
            type: Actions.SORT,
            value: e.target.value as Sort,
          }),
        sortOptions: <SortOptions />,
      }}
      totalCount={state.filteredValues.length}
    />
  );
}

function TitleListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <PosterListItem
      className={value.slug ? "bg-default" : "bg-unreviewed"}
      posterImageProps={value.posterImageProps}
    >
      <ListItemDetails>
        <ListItemTitle
          slug={value.slug}
          title={value.title}
          year={value.releaseYear}
        />
        <CreditedAs
          className="font-light text-subtle"
          values={value.creditedAs}
        />
        {value.grade && <ListItemGrade grade={value.grade} />}
        {!value.grade && (
          <WatchlistTitleSlug
            collectionNames={value.watchlistCollectionNames}
            directorNames={value.watchlistDirectorNames}
            performerNames={value.watchlistPerformerNames}
            writerNames={value.watchlistWriterNames}
          />
        )}
        {value.grade && (
          <ListItemReviewDate displayDate={value.reviewDisplayDate} />
        )}
        <ListItemGenres values={value.genres} />
      </ListItemDetails>
    </PosterListItem>
  );
}
