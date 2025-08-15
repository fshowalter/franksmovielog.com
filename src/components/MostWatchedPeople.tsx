import type { JSX } from "react";

import type { PosterImageProps } from "~/api/posters";

import { ListItemMediumAndVenue } from "./ListItemMediumAndVenue";
import { ListItemPoster } from "./ListItemPoster";

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
      <div
        className={`
          w-full
          tablet:whitespace-nowrap
        `}
      >
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
                <details
                  className={`
                    bg-subtle
                    tablet:px-2
                  `}
                >
                  <summary
                    className={`
                      cursor-pointer px-4 py-1 font-sans text-sm text-subtle
                      tablet:px-0
                    `}
                  >
                    Details
                  </summary>
                  <ol
                    className={`
                      tablet:grid
                      tablet:grid-cols-[repeat(auto-fill,minmax(33%,1fr))]
                      tablet:pt-2 tablet:pb-5
                    `}
                  >
                    {value.viewings.map((viewing) => {
                      return (
                        <MostWatchedPersonViewingListItem
                          key={viewing.viewingSequence}
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

function ListItemTitle({
  slug,
  title,
  year,
}: {
  slug?: string;
  title: string;
  year: string;
}) {
  const yearBox = (
    <span
      className={`
        text-xxs font-light text-subtle
        tablet:text-xs
      `}
    >
      {year}
    </span>
  );

  if (slug) {
    return (
      <a
        className={`
          block font-sans text-sm font-medium text-accent
          after:absolute after:top-0 after:left-0 after:size-full
          after:opacity-0
          tablet:text-xs
        `}
        href={`/reviews/${slug}/`}
      >
        {title}
        {"\u202F"}
        {"\u202F"}
        {yearBox}
      </a>
    );
  }

  return (
    <span
      className={`
        block font-sans text-sm font-normal text-muted
        tablet:text-xs
      `}
    >
      {title}
      {"\u202F"}
      {"\u202F"}
      {yearBox}
    </span>
  );
}

function MostWatchedPersonViewingListItem({
  value,
}: {
  value: ViewingSubListItemValue;
}) {
  return (
    <li
      className={`
        ${value.slug ? "bg-default" : "bg-unreviewed"}
        group/list-item relative mb-1 flex transform-gpu flex-row gap-x-[5%]
        py-4 text-wrap transition-transform
        tablet:flex-col tablet:gap-x-6 tablet:bg-transparent tablet:px-4
        tablet:has-[a:hover]:-translate-y-2 tablet:has-[a:hover]:bg-default
        tablet:has-[a:hover]:drop-shadow-2xl
        laptop:px-6
      `}
    >
      <div
        className={`
          relative w-1/4 max-w-[250px]
          after:absolute after:top-0 after:left-0 after:size-full
          after:bg-default after:opacity-15 after:transition-opacity
          group-has-[a:hover]/list-item:after:opacity-0
          tablet:w-auto
        `}
      >
        <ListItemPoster imageProps={value.posterImageProps} />
      </div>
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
        <div className="-mt-px font-sans text-xs font-light text-muted">
          {value.displayDate}
        </div>
        <ListItemMediumAndVenue medium={value.medium} venue={value.venue} />
      </div>
    </li>
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
