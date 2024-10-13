import { useReducer } from "react";

import type { BackdropImageProps } from "~/api/backdrops";
import type { PosterImageProps } from "~/api/posters";
import type { Review } from "~/api/reviews";

import { Backdrop } from "~/components/Backdrop";
import { Grade } from "~/components/Grade";
import { GroupedList } from "~/components/GroupedList";
import { ListItem } from "~/components/ListItem";
import { ListItemGenres } from "~/components/ListItemGenres";
import { ListItemPoster } from "~/components/ListItemPoster";
import { ListItemTitle } from "~/components/ListItemTitle";
import {
  ListWithFiltersLayout,
  SubNav,
} from "~/components/ListWithFiltersLayout";

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
      <div className="flex grow flex-col gap-y-2 tablet:w-full desktop:pr-4">
        <ListItemTitle
          slug={value.slug}
          title={value.title}
          year={value.year}
        />
        <Grade className="mb-1" height={18} value={value.grade} />
        <ListItemGenres values={value.genres} />
      </div>
    </ListItem>
  );
}
