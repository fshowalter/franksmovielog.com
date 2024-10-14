import { useReducer } from "react";

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

export type Props = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  distinctReleaseYears: readonly string[];
  initialSort: Sort;
  titles: ListItemValue[];
  value: Pick<
    CastAndCrewMember,
    "creditedAs" | "name" | "reviewCount" | "totalCount"
  >;
};

export type ListItemValue = {
  posterImageProps: PosterImageProps;
} & Pick<
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
>;

export function CastAndCrewMember({
  backdropImageProps,
  deck,
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
            <BreadcrumbLink href="/cast-and-crew/">Cast & Crew</BreadcrumbLink>
          }
          deck={deck}
          imageProps={backdropImageProps}
          title={value.name}
        />
      }
      data-pagefind-body
      filters={
        <Filters
          creditedAs={value.creditedAs}
          dispatch={dispatch}
          distinctReleaseYears={distinctReleaseYears}
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
    <ListItem background={value.slug ? "bg-default" : "bg-unreviewed"}>
      <ListItemPoster imageProps={value.posterImageProps} />
      <div className="flex grow flex-col gap-2 pb-2 tablet:w-full">
        <CreditedAs values={value.creditedAs} />
        <ListItemTitle
          slug={value.slug}
          title={value.title}
          year={value.year}
        />
        {value.grade && <Grade height={16} value={value.grade} />}
        {!value.grade && (
          <WatchlistTitleSlug
            collectionNames={value.collectionNames}
            directorNames={value.watchlistDirectorNames}
            performerNames={value.watchlistPerformerNames}
            writerNames={value.watchlistWriterNames}
          />
        )}
      </div>
    </ListItem>
  );
}
