import type { JSX } from "react";

import type { PosterImageProps } from "~/api/posters";

import { ListItemMediumAndVenue } from "./ListItemMediumAndVenue";
import { ListItemTitle } from "./ListItemTitle";
import { PosterList, PosterListItem } from "./PosterList";

export type MostWatchedPeopleListItemValue = {
  count: number;
  name: string;
  slug: string | undefined;
  viewings: ViewingSubListItemValue[];
};

type ViewingSubListItemValue = {
  displayDate: string;
  medium: string | undefined;
  posterImageProps: PosterImageProps;
  releaseYear: string;
  slug: string | undefined;
  title: string;
  venue: string | undefined;
  viewingSequence: number;
};

export function MostWatchedPeople({
  header,
  values,
}: {
  header: string;
  values: readonly MostWatchedPeopleListItemValue[];
}): false | JSX.Element {
  if (values.length === 0) {
    return false;
  }

  return (
    <section
      className={`
        w-full bg-default pb-8
        tablet:px-container
      `}
    >
      <h2
        className={`
          px-container py-4 text-xl font-medium
          tablet:px-0
        `}
      >
        {header}
      </h2>
      <div className={`w-full`}>
        {values.map((value) => {
          return (
            <div className="py-3" key={value.name}>
              <div
                className={`
                  flex justify-between px-container
                  tablet:px-0
                `}
              >
                <div
                  className={`
                    transform-gpu font-sans text-xs text-muted
                    transition-transform
                    has-[a:hover]:scale-110
                    tablet:text-sm
                  `}
                >
                  <Name value={value} />
                </div>
                <div
                  className={`
                    col-start-2 self-center pb-1 text-right font-sans text-xs
                    text-nowrap text-subtle
                  `}
                >
                  {value.count}
                </div>
              </div>
              <div
                className={`
                  col-span-2 row-start-2 px-container
                  tablet:px-0
                `}
              >
                <details className={`bg-subtle px-2`}>
                  <summary
                    className={`
                      cursor-pointer px-4 py-1 font-sans text-sm text-subtle
                      tablet:px-0
                    `}
                  >
                    Details
                  </summary>
                  <PosterList>
                    {value.viewings.map((viewing) => {
                      return (
                        <MostWatchedPersonViewingListItem
                          key={viewing.viewingSequence}
                          value={viewing}
                        />
                      );
                    })}
                  </PosterList>
                </details>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MostWatchedPersonViewingListItem({
  value,
}: {
  value: ViewingSubListItemValue;
}) {
  return (
    <PosterListItem
      className={`
        ${value.slug ? "bg-default" : "bg-unreviewed"}
      `}
      posterImageProps={value.posterImageProps}
    >
      <div
        className={`
          flex grow flex-col gap-2 px-1
          tablet:mt-2 tablet:grow-0
        `}
      >
        <ListItemTitle
          slug={value.slug}
          title={value.title}
          year={value.releaseYear}
        />
        <div className="font-sans text-xs font-light text-muted">
          {value.displayDate}
        </div>
        <ListItemMediumAndVenue medium={value.medium} venue={value.venue} />
      </div>
    </PosterListItem>
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
        className="inline-block leading-6 font-normal text-accent"
        href={`/cast-and-crew/${value.slug}/`}
      >
        {value.name}
      </a>
    );
  }

  return <span className="font-normal">{value.name}</span>;
}
