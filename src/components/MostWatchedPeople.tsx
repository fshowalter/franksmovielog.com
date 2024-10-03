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
                <div className="font-sans text-sm text-muted">
                  <Name value={value} />
                </div>
                <div className="col-start-2 self-center text-nowrap pb-1 text-right font-sans text-xs text-subtle">
                  {value.count}
                </div>
              </div>
              <div className="col-span-2 row-start-2 bg-subtle">
                <details className="bg-[#ededed] tablet:px-2">
                  <summary className="cursor-pointer px-container py-1 font-sans text-sm text-subtle tablet:px-0">
                    Details
                  </summary>
                  <ol className="py-1 tablet:px-4 tablet:pb-5 tablet:pt-2">
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
      <a
        className="inline-block font-normal leading-6 text-accent"
        href={`/cast-and-crew/${value.slug}/`}
      >
        {value.name}
      </a>
    );
  }

  return <span className="font-normal">{value.name}</span>;
}

function MostWatchedPersonViewingListItem({
  value,
}: {
  value: ViewingSubListItemValue;
}) {
  return (
    <ListItem background={value.slug ? "bg-default" : "bg-stripe"}>
      <ListItemPoster imageProps={value.posterImageProps} />
      <div className="flex grow flex-col gap-1">
        <ListItemTitle
          title={value.title}
          year={value.year}
          slug={value.slug}
        />
        <div className="-mt-px font-sans text-xs font-light text-muted">
          {value.date}
        </div>
        <ListItemMediumAndVenue medium={value.medium} venue={value.venue} />
      </div>
    </ListItem>
  );
}
