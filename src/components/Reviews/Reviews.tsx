import { useReducer } from "react";
import type { BackdropImageProps } from "src/api/backdrops";
import type { PosterImageProps } from "src/api/posters";
import type { Review } from "src/api/reviews";
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

import { Backdrop } from "../Backdrop";
import { Filters } from "./Filters";
import type { Sort } from "./Reviews.reducer";
import { Actions, initState, reducer } from "./Reviews.reducer";

export type ListItemValue = Pick<
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
> & {
  reviewDate: string;
  reviewMonth: string;
  reviewYear: string;
  posterImageProps: PosterImageProps;
};

export type Props = {
  values: ListItemValue[];
  initialSort: Sort;
  distinctGenres: readonly string[];
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  backdropImageProps: BackdropImageProps;
};

export function Reviews({
  values,
  initialSort,
  distinctGenres,
  distinctReleaseYears,
  distinctReviewYears,
  backdropImageProps,
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      values,
      initialSort,
    },
    initState,
  );

  return (
    <ListWithFiltersLayout
      backdrop={
        <Backdrop
          imageProps={backdropImageProps}
          title="Reviews"
          deck='"He chose... poorly."'
          alt="The guardian of the Grail in Indiana Jones and the Last Crusade (1989)"
        />
      }
      subNav={
        <SubNav
          values={[
            { href: "/reviews/", text: "all", active: true },
            { href: "/reviews/underseen/", text: "underseen" },
            { href: "/reviews/overrated/", text: "overrated" },
          ]}
        />
      }
      totalCount={state.filteredValues.length}
      filters={
        <Filters
          dispatch={dispatch}
          sortValue={state.sortValue}
          distinctGenres={distinctGenres}
          distinctReleaseYears={distinctReleaseYears}
          distinctReviewYears={distinctReviewYears}
        />
      }
      list={
        <GroupedList
          data-testid="list"
          groupedValues={state.groupedValues}
          visibleCount={state.showCount}
          totalCount={state.filteredValues.length}
          className="bg-default"
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
        >
          {(value) => <ReviewsListItem value={value} key={value.imdbId} />}
        </GroupedList>
      }
    />
  );
}

function ReviewsListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem className="">
      <ListItemPoster
        slug={value.slug}
        title={value.title}
        year={value.year}
        imageProps={value.posterImageProps}
      />
      <div className="flex grow flex-col gap-2 tablet:w-full desktop:pr-4">
        <ListItemTitle
          title={value.title}
          year={value.year}
          slug={value.slug}
        />
        <div className="mb-1 py-px">
          <Grade value={value.grade} height={18} className="-mt-1" />
        </div>
        <ListItemGenres values={value.genres} />
      </div>
    </ListItem>
  );
}
