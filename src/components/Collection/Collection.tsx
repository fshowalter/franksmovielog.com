import { useReducer } from "react";
import type { BackdropImageProps } from "src/api/backdrops";
import type { Collection, CollectionWithDetails } from "src/api/collections";
import type { PosterImageProps } from "src/api/posters";
import { Backdrop, BreadcrumbLink } from "src/components/Backdrop";
import { Grade } from "src/components/Grade";
import { GroupedList } from "src/components/GroupedList";
import { ListItem } from "src/components/ListItem";
import { ListItemPoster } from "src/components/ListItemPoster";
import { ListItemTitle } from "src/components/ListItemTitle";
import { ListWithFiltersLayout } from "src/components/ListWithFiltersLayout";

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
    CollectionWithDetails,
    "descriptionHtml" | "description" | "reviewCount" | "slug" | "name"
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
          deck={
            value.descriptionHtml ? (
              <span
                dangerouslySetInnerHTML={{ __html: value.descriptionHtml }}
              />
            ) : null
          }
          breadcrumb={
            <BreadcrumbLink href="/collections/">Collections</BreadcrumbLink>
          }
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
    <ListItem
      background={value.slug ? "bg-default" : "bg-unreviewed"}
      itemsCenter={true}
    >
      <ListItemPoster imageProps={value.posterImageProps} />
      <div className="grow tablet:w-full">
        <div>
          <ListItemTitle
            title={value.title}
            year={value.year}
            slug={value.slug}
          />
          {value.grade && (
            <Grade value={value.grade} height={18} className="mt-1 py-px" />
          )}
        </div>
      </div>
    </ListItem>
  );
}
