import type { PosterImageProps } from "~/api/posters";

import { ListItemMediumAndVenue } from "./ListItemMediumAndVenue";
import { ListItemPoster } from "./ListItemPoster";
import { ListItemTitle } from "./ListItemTitle";

type ViewingSubListItemValue = {
  date: string;
  medium: null | string;
  posterImageProps: PosterImageProps;
  sequence: number;
  slug: null | string;
  title: string;
  venue: null | string;
  year: string;
};

export type MostWatchedPeopleListItemValue = {
  count: number;
  name: string;
  slug: null | string;
  viewings: ViewingSubListItemValue[];
};

export function MostWatchedPeople({
  header,
  values,
}: {
  header: string;
  values: readonly MostWatchedPeopleListItemValue[];
}): JSX.Element | null {
  if (values.length == 0) {
    return null;
  }

  return (
    <section className="w-full bg-default pb-8 tablet:px-container">
      <h2 className="px-container py-4 text-xl font-medium tablet:px-0">
        {header}
      </h2>
      <div className="w-full tablet:whitespace-nowrap">
        {values.map((value) => {
          return (
            <div className="py-3" key={value.name}>
              <div className="flex justify-between px-container tablet:px-0">
                <div className="font-sans text-sm text-muted">
                  <Name value={value} />
                </div>
                <div className="col-start-2 self-center text-nowrap pb-1 text-right font-sans text-xs text-subtle">
                  {value.count}
                </div>
              </div>
              <div className="col-span-2 row-start-2 px-container tablet:px-0">
                <details className="bg-group tablet:px-2">
                  <summary className="cursor-pointer px-4 py-1 font-sans text-sm text-subtle tablet:px-0">
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
    <li
      className={`${value.slug ? "bg-default" : "bg-unreviewed"} relative mb-1 flex max-w-screen-max flex-row gap-x-4 py-4 tablet:gap-x-6 tablet:px-4 desktop:px-6`}
    >
      <ListItemPoster imageProps={value.posterImageProps} />
      <div className="flex grow flex-col gap-1">
        <ListItemTitle
          slug={value.slug}
          title={value.title}
          year={value.year}
        />
        <div className="-mt-px font-sans text-xs font-light text-muted">
          {value.date}
        </div>
        <ListItemMediumAndVenue medium={value.medium} venue={value.venue} />
      </div>
    </li>
  );
}
