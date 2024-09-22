import { useReducer } from "react";
import type { BackdropImageProps } from "src/api/backdrops";
import type { Collection } from "src/api/collections";
import type { PosterImageProps } from "src/api/posters";
import { ListWithFiltersLayout } from "src/components/ListWithFiltersLayout";

import { Backdrop } from "../Backdrop";
import { Grade } from "../Grade";
import { GroupedList } from "../GroupedList";
import { ListItem } from "../ListItem";
import { ListItemPoster } from "../ListItemPoster";
import { ListItemTitle } from "../ListItemTitle";
import { Actions, initState, reducer, type Sort } from "./Collection.reducer";
import { Filters } from "./Filters";

export type ListItemValue = Pick<
  Collection["titles"][0],
  | "imdbId"
  | "title"
  | "year"
  | "grade"
  | "gradeValue"
  | "slug"
  | "sortTitle"
  | "releaseSequence"
> & {
  posterImageProps: PosterImageProps;
};

export interface Props {
  value: Pick<
    Collection,
    "description" | "reviewCount" | "titleCount" | "slug" | "name"
  >;
  titles: ListItemValue[];
  distinctReleaseYears: readonly string[];
  initialSort: Sort;
  backdropImageProps: BackdropImageProps;
}

export function Collection({
  value,
  distinctReleaseYears,
  initialSort,
  titles,
  backdropImageProps,
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      values: [...titles],
      initialSort,
    },
    initState,
  );
  return (
    <ListWithFiltersLayout
      backdrop={
        <Backdrop
          imageProps={backdropImageProps}
          title={value.name}
          breadcrumb={<a href="/collections/">Collections</a>}
        />
      }
      totalCount={state.filteredValues.length}
      data-pagefind-body
      filters={
        <Filters
          dispatch={dispatch}
          hideReviewed={state.hideReviewed}
          sortValue={state.sortValue}
          distinctReleaseYears={distinctReleaseYears}
          showHideReviewed={value.reviewCount != titles.length}
        />
      }
      list={
        <GroupedList
          data-testid="list"
          groupedValues={state.groupedValues}
          visibleCount={state.showCount}
          totalCount={state.filteredValues.length}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
        >
          {(value) => {
            return <CollectionListItem value={value} key={value.imdbId} />;
          }}
        </GroupedList>
      }
    />
  );
}

function CollectionListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem className="items-center">
      <ListItemPoster slug={value.slug} imageProps={value.posterImageProps} />
      <div className="grow pr-gutter tablet:w-full desktop:pr-4">
        <div>
          <ListItemTitle
            title={value.title}
            year={value.year}
            slug={value.slug}
          />
          {value.grade && (
            <Grade value={value.grade} height={18} className="py-px" />
          )}
        </div>
      </div>
    </ListItem>
  );
}
