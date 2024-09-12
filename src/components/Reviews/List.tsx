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
      <div className="flex-row-reverse justify-between min-[1024px]:flex">
        <div
          className="flex max-w-screen-max basis-[33%] flex-wrap justify-between gap-6 bg-subtle px-[8%] py-10 *:shrink-0 *:grow *:basis-64 tablet:gap-8 tablet:px-12 min-[1024px]:-mt-[114px] min-[1024px]:!flex min-[1024px]:flex-col min-[1024px]:flex-nowrap min-[1024px]:justify-start min-[1024px]:*:grow-0 min-[1024px]:*:basis-0 desktop:px-20"
          style={{ display: showFilters ? "flex" : "none" }}
        >
          <legend className="-mb-6 hidden pb-10 font-sans-bold text-xs uppercase leading-[34px] tracking-[0.8px] text-subtle min-[1024px]:block">
            Filters
          </legend>
          <Filters
            dispatch={dispatch}
            sortValue={sortValue}
            distinctGenres={distinctGenres}
            distinctReleaseYears={distinctReleaseYears}
            distinctReviewYears={distinctReviewYears}
          />
        </div>
        <div className="grow">
          <GroupedList
            data-testid="list"
            groupedValues={groupedValues}
            visibleCount={visibleCount}
            totalCount={totalCount}
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
  dispatch,
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
    <div className="flex max-w-[calc(1696px_-_33%)] flex-wrap items-center justify-between gap-y-4 px-[8%] py-10 font-sans-bold text-xs font-bold uppercase tracking-[0.8px] text-subtle tablet:px-12 min-[1024px]:w-[calc(100%_-_33%)]">
      <span>{showingText}</span>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center px-4 text-sm uppercase shadow-all">
          <span className="mr-4 text-xs">Sort</span>
          <select
            value="title-asc"
            onChange={(e) =>
              dispatch({
                type: Actions.SORT,
                value: e.target.value as Sort,
              })
            }
            className="font-sans-narrow py-2 text-sm font-normal"
          >
            <option value="title-asc">Title (A &rarr; Z)</option>
            <option value="title-desc">Title (Z &rarr; A)</option>
            <option value="grade-desc">Grade (Best First)</option>
            <option value="grade-asc">Grade (Worst First)</option>
            <option value="release-date-desc">
              Release Date (Newest First)
            </option>
            <option value="release-date-asc">
              Release Date (Oldest First)
            </option>
            <option value="review-date-desc">Review Date (Newest First)</option>
            <option value="review-date-asc">Review Date (Oldest First)</option>
          </select>
        </label>
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-x-4 px-4 py-2 uppercase shadow-all min-[1024px]:hidden"
          style={{
            backgroundColor: showFilters
              ? "var(--bg-subtle)"
              : "var(--bg-default",
          }}
        >
          Filters
        </button>
      </div>
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
