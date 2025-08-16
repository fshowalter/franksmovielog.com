import type { JSX } from "react";

import { useReducer, useState } from "react";

import type { Collection, CollectionWithDetails } from "~/api/collections";
import type { PosterImageProps } from "~/api/posters";

import { Grade } from "~/components/Grade";
import { ListItemTitle } from "~/components/ListItemTitle";
import { ListWithFilters } from "~/components/ListWithFilters";
import { GroupedPosterList, PosterListItem } from "~/components/PosterList";

import type { Sort } from "./Collection.reducer";

import { Actions, initState, reducer } from "./Collection.reducer";
import { Filters, SortOptions } from "./Filters";

export type ListItemValue = Pick<
  Collection["titles"][0],
  | "grade"
  | "gradeValue"
  | "imdbId"
  | "releaseSequence"
  | "releaseYear"
  | "slug"
  | "sortTitle"
  | "title"
> & {
  posterImageProps: PosterImageProps;
  reviewDisplayDate: string;
  reviewSequence?: string;
  reviewYear: string;
};

export type Props = {
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: Sort;
  titles: ListItemValue[];
  value: Pick<
    CollectionWithDetails,
    "description" | "descriptionHtml" | "name" | "reviewCount" | "slug"
  >;
};

export function Collection({
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
          dispatch={dispatch}
          distinctReleaseYears={distinctReleaseYears}
          distinctReviewYears={distinctReviewYears}
          filterValues={state.pendingFilterValues}
          hideReviewed={state.hideReviewed}
          key={filterKey}
          showHideReviewed={value.reviewCount != titles.length}
        />
      }
      hasActiveFilters={Object.keys(state.pendingFilterValues).length > 0}
      list={
        <GroupedPosterList
          groupedValues={state.groupedValues}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
          totalCount={state.filteredValues.length}
          visibleCount={state.showCount}
        >
          {(value) => {
            return <CollectionListItem key={value.imdbId} value={value} />;
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

function CollectionListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <PosterListItem
      className={value.slug ? "bg-default" : "bg-unreviewed"}
      posterImageProps={value.posterImageProps}
    >
      <div
        className={`
          flex grow flex-col items-start gap-y-2
          tablet:mt-2 tablet:w-full
        `}
      >
        <ListItemTitle
          slug={value.slug}
          title={value.title}
          year={value.releaseYear}
        />
        {value.grade && (
          <Grade className="mb-1" height={16} value={value.grade} />
        )}
        <div className="font-sans text-xs leading-4 font-light text-subtle">
          {value.reviewDisplayDate}
        </div>
      </div>
    </PosterListItem>
  );
}
