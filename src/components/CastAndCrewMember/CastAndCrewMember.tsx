import { useReducer } from "react";
import type { AvatarImageProps } from "src/api/avatars";
import type { BackdropImageProps } from "src/api/backdrops";
import type { CastAndCrewMember } from "src/api/castAndCrew";
import type { PosterImageProps } from "src/api/posters";
import { ListWithFiltersLayout } from "src/components/ListWithFiltersLayout";

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
  avatarImageProps: AvatarImageProps;
  backdropImageProps: BackdropImageProps;
};

export const AvatarImageConfig = {
  width: 250,
  height: 250,
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
  avatarImageProps,
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
      title={value.name}
      alt={value.name}
      data-pagefind-body
      breadcrumb={<a href="/cast-and-crew/">Cast & Crew</a>}
      avatarImageProps={avatarImageProps}
      deck={deck(value)}
      backdropImageProps={backdropImageProps}
      totalCount={state.filteredValues.length}
      onToggleFilters={() => dispatch({ type: Actions.TOGGLE_FILTERS })}
      filtersVisible={state.showFilters}
      filters={
        <Filters
          dispatch={dispatch}
          distinctReleaseYears={distinctReleaseYears}
          creditedAs={value.creditedAs}
          sortValue={state.sortValue}
          hideReviewed={state.hi}
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
  const className = value.slug ? "bg-default" : "bg-subtle";

  return (
    <ListItem className={className}>
      <ListItemPoster
        slug={value.slug}
        title={value.title}
        year={value.year}
        imageProps={value.posterImageProps}
      />
      <div className="grow pr-gutter tablet:w-full desktop:pr-4">
        <div>
          <CreditedAs values={value.creditedAs} />
          <div className="spacer-y-2" />
          <ListItemTitle
            title={value.title}
            year={value.year}
            slug={value.slug}
          />
          <div className="spacer-y-2" />
          {value.grade && (
            <div className="py-px">
              <Grade value={value.grade} height={18} />
            </div>
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
          <div className="spacer-y-2" />
        </div>
      </div>
    </ListItem>
  );
}

function deck(value: Props["value"]) {
  const creditString = new Intl.ListFormat().format(value.creditedAs);

  const creditList =
    creditString.charAt(0).toUpperCase() + creditString.slice(1);

  let watchlistTitleCount;
  if (value.reviewCount === value.totalCount) {
    watchlistTitleCount = "";
  } else {
    watchlistTitleCount = ` and ${value.totalCount - value.reviewCount} watchlist`;
  }

  let titles;

  if (value.reviewCount === 1 && value.totalCount - value.reviewCount < 2) {
    titles = "title";
  } else {
    titles = `titles`;
  }

  return `${creditList} with ${value.reviewCount} reviewed${watchlistTitleCount} ${titles}.`;
}
