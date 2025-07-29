import { type JSX, useReducer } from "react";

import type { AvatarImageProps } from "~/api/avatars";
import type { BackdropImageProps } from "~/api/backdrops";
import type { CastAndCrewMember } from "~/api/castAndCrew";
import type { PosterImageProps } from "~/api/posters";

import { Backdrop, BreadcrumbLink } from "~/components/Backdrop";
import { CreditedAs } from "~/components/CreditedAs";
import { Grade } from "~/components/Grade";
import { GroupedList } from "~/components/GroupedList";
import { ListItem } from "~/components/ListItem";
import { ListItemPoster } from "~/components/ListItemPoster";
import { ListItemTitle } from "~/components/ListItemTitle";
import { ListWithFiltersLayout } from "~/components/ListWithFiltersLayout";
import { WatchlistTitleSlug } from "~/components/WatchlistTitleSlug";

import {
  Actions,
  initState,
  reducer,
  type Sort,
} from "./CastAndCrewMember.reducer";
import { Filters } from "./Filters";

export type ListItemValue = Pick<
  CastAndCrewMember["titles"][0],
  | "collectionNames"
  | "creditedAs"
  | "grade"
  | "gradeValue"
  | "imdbId"
  | "releaseSequence"
  | "slug"
  | "sortTitle"
  | "title"
  | "watchlistDirectorNames"
  | "watchlistPerformerNames"
  | "watchlistWriterNames"
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
  deck: string;
  distinctReleaseYears: readonly string[];
  distinctReviewYears: readonly string[];
  initialSort: Sort;
  titles: ListItemValue[];
  value: Pick<
    CastAndCrewMember,
    "creditedAs" | "name" | "reviewCount" | "totalCount"
  >;
};

export function CastAndCrewMember({
  avatarImageProps,
  backdropImageProps,
  deck,
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
          bottomShadow={true}
          breadcrumb={
            <BreadcrumbLink href="/cast-and-crew/">Cast & Crew</BreadcrumbLink>
          }
          deck={deck}
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
          creditedAs={value.creditedAs}
          dispatch={dispatch}
          distinctReleaseYears={distinctReleaseYears}
          distinctReviewYears={distinctReviewYears}
          hideReviewed={state.hideReviewed}
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
            return <TitleListItem key={value.imdbId} value={value} />;
          }}
        </GroupedList>
      }
      totalCount={state.filteredValues.length}
    />
  );
}

function TitleListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem
      background={value.slug ? "bg-default" : "bg-unreviewed"}
      className={`
        group/list-item relative transform-gpu transition-transform
        has-[a:hover]:z-30 has-[a:hover]:scale-105 has-[a:hover]:shadow-all
        has-[a:hover]:drop-shadow-2xl
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
        <CreditedAs values={value.creditedAs} />
        <ListItemTitle
          slug={value.slug}
          title={value.title}
          year={value.year}
        />
        {value.grade && (
          <Grade className="mb-1" height={16} value={value.grade} />
        )}
        {!value.grade && (
          <WatchlistTitleSlug
            collectionNames={value.collectionNames}
            directorNames={value.watchlistDirectorNames}
            performerNames={value.watchlistPerformerNames}
            writerNames={value.watchlistWriterNames}
          />
        )}
        <div className="font-sans text-xs leading-4 font-light text-subtle">
          {value.reviewDisplayDate}
        </div>
      </div>
    </ListItem>
  );
}
