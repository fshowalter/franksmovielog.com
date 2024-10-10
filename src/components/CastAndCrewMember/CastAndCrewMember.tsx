import { useReducer } from "react";
import type { BackdropImageProps } from "src/api/backdrops";
import type { CastAndCrewMember } from "src/api/castAndCrew";
import type { PosterImageProps } from "src/api/posters";
import { ListWithFiltersLayout } from "src/components/ListWithFiltersLayout";

import { Backdrop, BreadcrumbLink } from "../Backdrop";
import { CreditedAs } from "../CreditedAs";
import { Grade } from "../Grade";
import { GroupedList } from "../GroupedList";
import { ListItem } from "../ListItem";
import { ListItemPoster } from "../ListItemPoster";
import { ListItemTitle } from "../ListItemTitle";
import { WatchlistTitleSlug } from "../WatchlistTitleSlug";
import {
  Actions,
  initState,
  reducer,
  type Sort,
} from "./CastAndCrewMember.reducer";
import { Filters } from "./Filters";

export type Props = {
  value: Pick<
    CastAndCrewMember,
    "name" | "reviewCount" | "totalCount" | "creditedAs"
  >;
  titles: ListItemValue[];
  initialSort: Sort;
  distinctReleaseYears: readonly string[];
  backdropImageProps: BackdropImageProps;
  deck: string;
};

export type ListItemValue = Pick<
  CastAndCrewMember["titles"][0],
  | "imdbId"
  | "title"
  | "year"
  | "grade"
  | "gradeValue"
  | "slug"
  | "sortTitle"
  | "releaseSequence"
  | "creditedAs"
  | "watchlistDirectorNames"
  | "watchlistPerformerNames"
  | "watchlistWriterNames"
  | "collectionNames"
> & {
  posterImageProps: PosterImageProps;
};

export function CastAndCrewMember({
  value,
  titles,
  initialSort,
  distinctReleaseYears,
  backdropImageProps,
  deck,
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
      data-pagefind-body
      backdrop={
        <Backdrop
          imageProps={backdropImageProps}
          breadcrumb={
            <BreadcrumbLink href="/cast-and-crew/">Cast & Crew</BreadcrumbLink>
          }
          title={value.name}
          deck={deck}
        />
      }
      totalCount={state.filteredValues.length}
      filters={
        <Filters
          dispatch={dispatch}
          distinctReleaseYears={distinctReleaseYears}
          creditedAs={value.creditedAs}
          sortValue={state.sortValue}
          hideReviewed={state.hideReviewed}
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
            return <TitleListItem value={value} key={value.imdbId} />;
          }}
        </GroupedList>
      }
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
          title={value.title}
          year={value.year}
          slug={value.slug}
        />
        {value.grade && (
          <Grade value={value.grade} height={18} className="py-px" />
        )}
        {!value.grade && (
          <>
            <WatchlistTitleSlug
              directorNames={value.watchlistDirectorNames}
              performerNames={value.watchlistPerformerNames}
              writerNames={value.watchlistWriterNames}
              collectionNames={value.collectionNames}
            />
          </>
        )}
      </div>
    </ListItem>
  );
}
