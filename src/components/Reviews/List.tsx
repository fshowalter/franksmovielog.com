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
    <div className="showFilters:grid showFilters:grid-rows-[auto_1fr] showFilters:px-0 relative grid-cols-[1fr_48px_33%] bg-default tablet:px-12">
      <div className="showFilters:ml-12 relative z-20 row-start-1 bg-default text-xs shadow-bottom desktop:ml-20">
        <ListHeader
          visibleCount={visibleCount}
          totalCount={totalCount}
          onToggleFilters={() => dispatch({ type: Actions.TOGGLE_FILTERS })}
          dispatch={dispatch}
          showFilters={showFilters}
        />
      </div>
      <div
        className="showFilters:block showFilters:pb-12 showFilters:shadow-none relative z-10 col-start-3 row-span-2 row-start-1 grid bg-subtle px-[8%] text-sm shadow-bottom transition-[grid-template-rows] duration-200 ease-in-out tablet:px-12 desktop:py-24 desktop:pr-20"
        style={{
          gridTemplateRows: showFilters ? "1fr" : "0fr",
        }}
      >
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
      <div className="showFilters:pl-12 col-start-1 row-start-2 bg-default desktop:pl-20">
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

  if (visibleCount < totalCount) {
    showingText = (
      <>
        <span className="font-sans-bold">{totalCount.toLocaleString()}</span>{" "}
        Results
      </>
    );
  } else {
    showingText = (
      <>
        <span className="font-sans-bold">{totalCount.toLocaleString()}</span>{" "}
        Results
      </>
    );
  }

  return (
    <div className="flex w-full items-center justify-between gap-12 px-[8%] font-sans-bold uppercase tracking-[0.8px] text-subtle tablet:px-0">
      <span className="block py-10 tablet:w-full">{showingText}</span>
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
