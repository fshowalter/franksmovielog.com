import type { PosterImageProps } from "src/api/posters";

import { ListItem } from "./ListItem";
import { ListItemMediumAndVenue } from "./ListItemMediumAndVenue";
import { ListItemPoster } from "./ListItemPoster";
import { ListItemTitle } from "./ListItemTitle";

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
    <section className="w-full bg-default pb-8 tablet:px-container">
      <h2 className="px-container py-4 font-medium tablet:px-0 desktop:text-xl">
        {header}
      </h2>
      <div className="w-full tablet:whitespace-nowrap">
        {values.map((value) => {
          return (
            <div key={value.name} className="py-3">
              <div className="flex justify-between px-container tablet:px-0">
                <div className="font-sans-narrow text-sm text-muted">
                  <Name value={value} />
                </div>
                <div className="col-start-2 self-center text-nowrap pb-1 text-right font-sans-narrow text-sm text-subtle tablet:text-sm">
                  {value.count}
                </div>
              </div>
              <div className="col-span-2 row-start-2 bg-subtle px-container tablet:px-0">
                <details>
                  <summary className="py-1 font-sans text-sm text-subtle tablet:px-gutter desktop:px-2">
                    Details
                  </summary>
                  <ol className="py-4 tablet:px-gutter">
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
            </div>
          );
        })}
      </div>
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
  const className = value.slug ? "bg-default" : "bg-subtle";

  return (
    <ListItem className={className}>
      <ListItemPoster
        slug={value.slug}
        title={value.title}
        year={value.year}
        imageProps={value.posterImageProps}
      />
      <div className="grow">
        <ListItemTitle
          title={value.title}
          year={value.year}
          slug={value.slug}
        />
        <div className="pb-2 pt-1 font-sans text-xs font-light text-muted">
          {value.date}
        </div>
        <ListItemMediumAndVenue medium={value.medium} venue={value.venue} />
      </div>
    </ListItem>
  );
}
