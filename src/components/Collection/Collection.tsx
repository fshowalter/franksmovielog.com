import { useReducer } from "react";

import type { BackdropImageProps } from "~/api/backdrops";
import type { Collection, CollectionWithDetails } from "~/api/collections";
import type { PosterImageProps } from "~/api/posters";

import { Backdrop, BreadcrumbLink } from "~/components/Backdrop";
import { Grade } from "~/components/Grade";
import { GroupedList } from "~/components/GroupedList";
import { ListItem } from "~/components/ListItem";
import { ListItemPoster } from "~/components/ListItemPoster";
import { ListItemTitle } from "~/components/ListItemTitle";
import { ListWithFiltersLayout } from "~/components/ListWithFiltersLayout";

import { Actions, initState, reducer, type Sort } from "./Collection.reducer";
import { Filters } from "./Filters";

export type ListItemValue = {
  posterImageProps: PosterImageProps;
} & Pick<
  Collection["titles"][0],
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
  distinctReleaseYears: readonly string[];
  initialSort: Sort;
  titles: ListItemValue[];
  value: Pick<
    CollectionWithDetails,
    "description" | "descriptionHtml" | "name" | "reviewCount" | "slug"
  >;
};

export function Collection({
  backdropImageProps,
  distinctReleaseYears,
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
  return (
    <ListWithFiltersLayout
      backdrop={
        <Backdrop
          breadcrumb={
            <BreadcrumbLink href="/collections/">Collections</BreadcrumbLink>
          }
          deck={
            value.descriptionHtml ? (
              <span
                dangerouslySetInnerHTML={{ __html: value.descriptionHtml }}
              />
            ) : undefined
          }
          imageProps={backdropImageProps}
          title={value.name}
        />
      }
      data-pagefind-body
      filters={
        <Filters
          dispatch={dispatch}
          distinctReleaseYears={distinctReleaseYears}
          hideReviewed={state.hideReviewed}
          showHideReviewed={value.reviewCount != titles.length}
          sortValue={state.sortValue}
        />
      }
      list={
        <GroupedList
          data-testid="list"
          groupedValues={state.groupedValues}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
          totalCount={state.filteredValues.length}
          visibleCount={state.showCount}
        >
          {(value) => {
            return <CollectionListItem key={value.imdbId} value={value} />;
          }}
        </GroupedList>
      }
      totalCount={state.filteredValues.length}
    />
  );
}

function CollectionListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem
      background={value.slug ? "bg-default" : "bg-unreviewed"}
      itemsCenter={true}
    >
      <ListItemPoster imageProps={value.posterImageProps} />
      <div className="grow tablet:w-full">
        <div>
          <ListItemTitle
            slug={value.slug}
            title={value.title}
            year={value.year}
          />
          {value.grade && (
            <Grade className="mt-1 py-px" height={18} value={value.grade} />
          )}
        </div>
      </div>
    </ListItem>
  );
}
