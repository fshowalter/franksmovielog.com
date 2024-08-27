import type { PosterImageProps } from "src/api/posters";

import { ListItem } from "./ListItem";
import { ListItemMediumAndVenue } from "./ListItemMediumAndVenue";
import { ListItemPoster } from "./ListItemPoster";
import { ListItemTitle } from "./ListItemTitle";
import { StatHeading } from "./StatHeading";

interface ViewingSubListItemValue {
  sequence: number;
  date: string;
  venue: string | null;
  medium: string | null;
  title: string;
  year: string;
  slug: string | null;
  posterImageProps: PosterImageProps;
}

export interface MostWatchedPeopleListItemValue {
  name: string;
  slug: string | null;
  count: number;
  viewings: ViewingSubListItemValue[];
}

export function MostWatchedPeople({
  values,
  header,
}: {
  header: string;
  values: readonly MostWatchedPeopleListItemValue[];
}): JSX.Element | null {
  if (values.length == 0) {
    return null;
  }

  return (
    <section className="shadow-all">
      <StatHeading>{header}</StatHeading>
      <header className="sticky top-10 z-30 flex justify-between bg-default px-gutter font-bold leading-[calc(2.5rem_-_2px)] desktop:top-[calc(var(--header-offset)_+_2.5rem)] max:top-[calc(var(--header-offset)_+_2.5rem)]">
        <span className="text-left leading-10">Name</span>
        <span className="text-right leading-10">Viewings</span>
      </header>
      <ol>
        {values.map((value, index) => {
          return (
            <li key={value.name} className="block">
              <div
                style={{ zIndex: 1 + index }}
                className="sticky top-20 grid w-full grid-cols-[auto_1fr_calc(6ch_+_var(--gutter-width))] bg-stripe px-gutter leading-10 desktop:top-[calc(var(--header-offset)_+_5rem)] max:top-[calc(var(--header-offset)_+_5rem)]"
              >
                <span className="leading-10">
                  <Name value={value} />
                </span>
                <span className="leading-10">&nbsp;</span>
                <span className="bg-stripe text-right leading-10">
                  {value.count}
                </span>
              </div>
              <div className="col-start-1 col-end-4 leading-10">
                <details>
                  <summary className="px-gutter tracking-0.25px text-subtle">
                    Details
                  </summary>
                  <ol className="tablet:px-gutter">
                    {value.viewings.map((viewing) => {
                      return (
                        <MostWatchedPersonViewingListItem
                          key={viewing.sequence}
                          value={viewing}
                        />
                      );
                    })}
                  </ol>
                </details>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Name({
  value,
}: {
  value: MostWatchedPeopleListItemValue;
}): JSX.Element {
  if (value.slug) {
    return (
      <a className="text-accent" href={`/cast-and-crew/${value.slug}/`}>
        {value.name}
      </a>
    );
  }

  return <>{value.name}</>;
}

function MostWatchedPersonViewingListItem({
  value,
}: {
  value: ViewingSubListItemValue;
}) {
  return (
    <ListItem className="items-center">
      <ListItemPoster
        slug={value.slug}
        title={value.title}
        year={value.year}
        imageProps={value.posterImageProps}
      />
      <div className="grow">
        <div>
          <ListItemTitle
            title={value.title}
            year={value.year}
            slug={value.slug}
          />
          <div className="spacer-y-1 tablet:spacer-y-2" />
        </div>
        <div className="flex flex-col text-sm font-light tracking-0.5px text-subtle">
          <div className="spacer-y-1 tablet:spacer-y-0" />
          <div>
            {value.date}
            <div className="spacer-y-2" />
            <ListItemMediumAndVenue medium={value.medium} venue={value.venue} />
          </div>
        </div>
        <div className="spacer-y-2" />
      </div>
    </ListItem>
  );
}
