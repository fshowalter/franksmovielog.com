import type { BackdropImageProps } from "src/api/backdrops";
import type { PosterImageProps } from "src/api/posters";
import type { Review } from "src/api/reviews";

import { useReducer } from "react";
import { Backdrop } from "src/components/Backdrop";
import { Grade } from "src/components/Grade";
import { GroupedList } from "src/components/GroupedList";
import { ListItem } from "src/components/ListItem";
import { ListItemGenres } from "src/components/ListItemGenres";
import { ListItemPoster } from "src/components/ListItemPoster";
import { ListItemTitle } from "src/components/ListItemTitle";
import {
  ListWithFiltersLayout,
  SubNav,
} from "src/components/ListWithFiltersLayout";

import type { Sort } from "./Reviews.reducer";

import { Filters } from "./Filters";
import { Actions, initState, reducer } from "./Reviews.reducer";

export type ListItemValue = {
  posterImageProps: PosterImageProps;
  reviewDate: string;
  reviewMonth: string;
  reviewYear: string;
} & Pick<
  Review,
  | "genres"
  | "grade"
  | "gradeValue"
  | "imdbId"
  | "releaseSequence"
  | "slug"
  | "sortTitle"
  | "title"
  | "year"
>;

export type Props = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: Sort;
  values: ListItemValue[];
};

export function Reviews({
  backdropImageProps,
  deck,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  initialSort,
  values,
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    initState,
  );

  return (
    <ListWithFiltersLayout
      backdrop={
        <Backdrop deck={deck} imageProps={backdropImageProps} title="Reviews" />
      }
      filters={
        <Filters
          dispatch={dispatch}
          distinctGenres={distinctGenres}
          distinctReleaseYears={distinctReleaseYears}
          distinctReviewYears={distinctReviewYears}
          sortValue={state.sortValue}
        />
      }
      list={
        <GroupedList
          className="bg-default"
          data-testid="list"
          groupedValues={state.groupedValues}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
          totalCount={state.filteredValues.length}
          visibleCount={state.showCount}
        >
          {(value) => <ReviewsListItem key={value.imdbId} value={value} />}
        </GroupedList>
      }
      subNav={
        <SubNav
          values={[
            { active: true, href: "/reviews/", text: "all" },
            { href: "/reviews/underseen/", text: "underseen" },
            { href: "/reviews/overrated/", text: "overrated" },
          ]}
        />
      }
      totalCount={state.filteredValues.length}
    />
  );
}

function ReviewsListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem>
      <ListItemPoster imageProps={value.posterImageProps} />
      <div className="flex grow flex-col gap-2 tablet:w-full desktop:pr-4">
        <ListItemTitle
          slug={value.slug}
          title={value.title}
          year={value.year}
        />
        <div className="mb-1 py-px">
          <Grade className="-mt-1" height={18} value={value.grade} />
        </div>
        <ListItemGenres values={value.genres} />
      </div>
    </ListItem>
  );
}
