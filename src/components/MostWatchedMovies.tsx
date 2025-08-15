import type { JSX } from "react";

import type { PosterImageProps } from "~/api/posters";

import { ccn } from "~/utils/concatClassNames";

import { ListItemWithPoster } from "./ListItemWithPoster";

export const MostWatchedMoviesPosterConfig = {
  height: 375,
  sizes: "(min-width: 780px) 248px, 64px",
  width: 250,
};

export type MostWatchedMoviesListItemValue = {
  count: number;
  imdbId: string;
  posterImageProps: PosterImageProps;
  releaseYear: string;
  slug: string | undefined;
  title: string;
};

export function MostWatchedMovies({
  className,
  values,
}: {
  className?: string;
  values: readonly MostWatchedMoviesListItemValue[];
}): false | JSX.Element {
  if (values.length === 0) {
    return false;
  }

  return (
    <section
      className={ccn(
        `
          max-w-[calc(298px_*_4)] pb-5
          laptop:pb-10
        `,
        className,
      )}
    >
      <h2
        className={`
          px-container py-4 text-xl font-medium shadow-bottom
          tablet:text-center tablet:text-2xl
          laptop:py-8
        `}
      >
        Most Watched Movies
      </h2>
      <List>
        {values.map((value) => {
          return <ListItem key={value.imdbId} value={value} />;
        })}
      </List>
    </section>
  );
}

function List({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="@container/most-watched-movies">
      <ol
        className={`
          items-center justify-center gap-y-8 bg-subtle
          [--most-watched-movies-list-item-width:50%]
          tablet:flex tablet:flex-wrap tablet:items-start
          @min-[calc(298px_*_2)]/most-watched-movies:[--most-watched-movies-list-item-width:33.33%]
          @min-[calc(298px_*_3)]/most-watched-movies:[--most-watched-movies-list-item-width:25%]
        `}
      >
        {children}
      </ol>
    </div>
  );
}

function ListItem({
  value,
}: {
  value: MostWatchedMoviesListItemValue;
}): JSX.Element {
  return (
    <ListItemWithPoster
      className={`tablet:w-(--most-watched-movies-list-item-width)`}
      posterImageProps={value.posterImageProps}
    >
      <div
        className={`
          flex flex-col justify-center
          tablet:w-full
        `}
      >
        <Title slug={value.slug} title={value.title} year={value.releaseYear} />
        <div
          className={`
            mt-1 flex justify-start font-sans text-xs font-light text-subtle
            tablet:justify-center
          `}
        >
          {value.count.toLocaleString()} times
        </div>
      </div>
    </ListItemWithPoster>
  );
}

function Title({
  slug,
  title,
  year,
}: {
  slug?: string | undefined;
  title: string;
  year: string;
}) {
  const yearBox = (
    <span className={`text-xs leading-none font-light text-subtle`}>
      {year}
    </span>
  );

  if (slug) {
    return (
      <a
        className={`
          block pt-2 font-sans text-sm leading-4 font-medium text-accent
          decoration-accent
          after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
          after:opacity-0
          tablet:text-center
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
        tablet:text-center
      `}
    >
      {title}
      {"\u202F"}
      {"\u202F"}
      {yearBox}
    </span>
  );
}
