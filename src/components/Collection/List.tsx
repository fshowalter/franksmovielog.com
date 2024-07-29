import type { Collection } from "src/api/collections";
import type { PosterImageProps } from "src/api/posters";
import { Grade } from "src/components/Grade";
import { GroupedList } from "src/components/GroupedList";
import { ListItem } from "src/components/ListItem";
import { ListItemPoster } from "src/components/ListItemPoster";
import { ListItemTitle } from "src/components/ListItemTitle";

import { Actions, type ActionType } from "./Collection.reducer";

export interface ListItemValue
  extends Pick<
    Collection["titles"][0],
    | "imdbId"
    | "title"
    | "year"
    | "grade"
    | "gradeValue"
    | "slug"
    | "sortTitle"
    | "releaseSequence"
  > {
  posterImageProps: PosterImageProps;
}

export function List({
  groupedValues,
  dispatch,
  totalCount,
  visibleCount,
}: {
  groupedValues: Map<string, ListItemValue[]>;
  dispatch: React.Dispatch<ActionType>;
  totalCount: number;
  visibleCount: number;
}) {
  return (
    <GroupedList
      data-testid="list"
      groupedValues={groupedValues}
      visibleCount={visibleCount}
      totalCount={totalCount}
      onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
    >
      {(value) => {
        return <CollectionListItem value={value} key={value.imdbId} />;
      }}
    </GroupedList>
  );
}

function CollectionListItem({ value }: { value: ListItemValue }): JSX.Element {
  return (
    <ListItem className="items-center">
      <ListItemPoster
        slug={value.slug}
        title={value.title}
        imageProps={value.posterImageProps}
        year={value.year}
      />
      <div className="grow pr-gutter tablet:w-full desktop:pr-4">
        <div>
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
          <div className="spacer-y-2" />
        </div>
      </div>
    </ListItem>
  );
}
