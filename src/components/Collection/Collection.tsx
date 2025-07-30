import { type JSX, useReducer } from "react";

import type { AvatarImageProps } from "~/api/avatars";
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

import type { Sort } from "./Collection.reducer";

import { Actions, initState, reducer } from "./Collection.reducer";
import { Filters, SortOptions } from "./Filters";

export type ListItemValue = Pick<
  Collection["titles"][0],
  | "grade"
  | "gradeValue"
  | "imdbId"
  | "releaseSequence"
  | "slug"
  | "sortTitle"
  | "title"
  | "year"
> & {
  posterImageProps: PosterImageProps;
  reviewDisplayDate: string;
  reviewSequence?: string;
  reviewYear: string;
};

export type Props = {
  avatarImageProps: AvatarImageProps | undefined;
  backdropImageProps: BackdropImageProps;
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
  avatarImageProps,
  backdropImageProps,
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
      data-pagefind-meta={
        avatarImageProps ? `image:${avatarImageProps.src}` : ""
      }
      filters={
        <Filters
          dispatch={dispatch}
          distinctReleaseYears={distinctReleaseYears}
          distinctReviewYears={distinctReviewYears}
          hideReviewed={state.hideReviewed}
          showHideReviewed={value.reviewCount != titles.length}
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
    <ListItem
      background={value.slug ? "bg-default" : "bg-unreviewed"}
      className={`
        group/list-item relative transform-gpu transition-transform
        tablet-landscape:has-[a:hover]:z-30
        tablet-landscape:has-[a:hover]:scale-105
        tablet-landscape:has-[a:hover]:shadow-all
        tablet-landscape:has-[a:hover]:drop-shadow-2xl
      `}
    >
      <div
        className={`
          relative
          after:absolute after:top-0 after:left-0 after:z-10 after:size-full
          after:bg-default after:opacity-15 after:transition-opacity
          group-has-[a:hover]/list-item:after:opacity-0
        `}
      >
        <ListItemPoster imageProps={value.posterImageProps} />
      </div>
      <div
        className={`
          flex grow flex-col items-start gap-y-2
          tablet:w-full
          laptop:pr-4
        `}
      >
        <ListItemTitle
          slug={value.slug}
          title={value.title}
          year={value.year}
        />
        {value.grade && (
          <Grade className="mb-1" height={16} value={value.grade} />
        )}
        <div className="font-sans text-xs leading-4 font-light text-subtle">
          {value.reviewDisplayDate}
        </div>
      </div>
    </ListItem>
  );
}
