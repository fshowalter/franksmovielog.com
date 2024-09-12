import type { PosterImageProps } from "src/api/posters";
import type { Review } from "src/api/reviews";
import { Grade } from "src/components/Grade";
import { GroupedList } from "src/components/GroupedList";
import { ListItem } from "src/components/ListItem";
import { ListItemGenres } from "src/components/ListItemGenres";
import { ListItemPoster } from "src/components/ListItemPoster";
import { ListItemTitle } from "src/components/ListItemTitle";

import { LabelText } from "../LabelText";
import { SelectInput } from "../SelectInput";
import { Filters } from "./Filters";
import type { ActionType } from "./Reviews.reducer";
import { Actions } from "./Reviews.reducer";

export interface ListItemValue
  extends Pick<
    Review,
    | "imdbId"
    | "releaseSequence"
    | "title"
    | "year"
    | "sortTitle"
    | "slug"
    | "grade"
    | "gradeValue"
    | "genres"
  > {
  reviewDate: string;
  reviewMonth: string;
  reviewYear: string;
  posterImageProps: PosterImageProps;
}

export function List({
  groupedValues,
  totalCount,
  visibleCount,
  dispatch,
  sortValue,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  showFilters,
}: {
  groupedValues: Map<string, ListItemValue[]>;
  totalCount: number;
  visibleCount: number;
  dispatch: React.Dispatch<ActionType>;
}) {
  return (
    <>
      <ListHeader
        visibleCount={visibleCount}
        totalCount={totalCount}
        onToggleFilters={() => dispatch({ type: Actions.TOGGLE_FILTERS })}
        dispatch={dispatch}
        showFilters={showFilters}
      />
      <div className="flex-row-reverse justify-between gap-12 min-[1024px]:flex">
        <div className="basis-[33%] bg-subtle tablet:bg-default min-[1024px]:bg-subtle">
          <Filters
            dispatch={dispatch}
            sortValue={sortValue}
            distinctGenres={distinctGenres}
            distinctReleaseYears={distinctReleaseYears}
            distinctReviewYears={distinctReviewYears}
            onToggleFilters={() => dispatch({ type: Actions.TOGGLE_FILTERS })}
            showFilters={showFilters}
          />
        </div>
        <div className="grow bg-default min-[1024px]:pr-12">
          <GroupedList
            data-testid="list"
            groupedValues={groupedValues}
            visibleCount={visibleCount}
            totalCount={totalCount}
            className="bg-default"
            onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
          >
            {(value) => <ReviewsListItem value={value} key={value.imdbId} />}
          </GroupedList>
        </div>
      </div>
    </>
  );
}

export function ListHeader({
  visibleCount,
  totalCount,
  onToggleFilters,
  showFilters,
}: {
  visibleCount: number;
  totalCount: number;
  onToggleFilters: () => void;
  dispatch: React.Dispatch<ActionType>;
}): JSX.Element {
  let showingText;

  if (visibleCount > totalCount) {
    showingText = `Showing ${totalCount.toLocaleString()} of ${totalCount.toLocaleString()}`;
  } else {
    showingText = `Showing 1-${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`;
  }

  return (
    <div className="z-10 flex items-center justify-between gap-y-4 bg-default px-[8%] font-sans-bold text-xs uppercase tracking-[0.8px] text-subtle shadow-bottom tablet:px-0 min-[1024px]:w-[calc(100%_-_33%_-_48px)] min-[1024px]:pr-12 min-[1024px]:shadow-none">
      <span className="block py-10 tablet:w-full tablet:pl-0 min-[1024px]:shadow-bottom">
        {showingText}
      </span>
      <button
        onClick={onToggleFilters}
        className="flex items-center gap-x-4 text-nowrap px-4 py-2 uppercase shadow-all min-[1024px]:hidden"
        style={{
          backgroundColor: showFilters
            ? "var(--bg-subtle)"
            : "var(--bg-default",
        }}
      >
        Filter & Sort
      </button>
    </div>
  );
}

function ReviewsListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem>
      <ListItemPoster
        slug={value.slug}
        title={value.title}
        year={value.year}
        imageProps={value.posterImageProps}
      />
      <div className="flex grow flex-col tablet:w-full desktop:pr-4">
        <ListItemTitle
          title={value.title}
          year={value.year}
          slug={value.slug}
        />
        <div className="spacer-y-1" />
        <div className="py-px">
          <Grade value={value.grade} height={18} />
        </div>
        <div className="spacer-y-1" />
        <ListItemGenres values={value.genres} />
      </div>
    </ListItem>
  );
}
