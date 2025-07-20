import type { JSX } from "react";

import type { PosterImageProps } from "~/api/posters";

import { ccn } from "~/utils/concatClassNames";

import { Poster } from "./Poster";

export const MostWatchedMoviesPosterConfig = {
  height: 354,
  sizes: "(min-width: 780px) 248px, 64px",
  width: 236,
};

export type MostWatchedMoviesListItemValue = {
  count: number;
  imdbId: string;
  posterImageProps: PosterImageProps;
  slug: string | undefined;
  title: string;
  year: string;
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
          max-w-(--breakpoint-laptop) pb-5
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

function FluidListItemPoster({
  className,
  imageProps,
}: {
  className?: string;
  imageProps: PosterImageProps;
  slug: string | undefined;
  title: string;
  year: string;
}) {
  return (
    <div
      className={ccn(
        `
          w-list-item-poster shrink-0
          tablet:w-auto tablet:max-w-[248px]
        `,
        className,
      )}
    >
      <Poster
        className="h-auto rounded-[2.5px]"
        decoding="async"
        height={MostWatchedMoviesPosterConfig.height}
        imageProps={imageProps}
        loading="lazy"
        sizes={MostWatchedMoviesPosterConfig.sizes}
        width={MostWatchedMoviesPosterConfig.width}
      />
    </div>
  );
}

function List({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ol
      className={`
        grid-cols-[repeat(auto-fit,minmax(128px,248px))] items-center
        justify-center gap-x-6 gap-y-8 bg-subtle
        tablet:grid tablet:items-start
      `}
    >
      {children}
    </ol>
  );
}

function ListItem({
  value,
}: {
  value: MostWatchedMoviesListItemValue;
}): JSX.Element {
  return (
    <li
      className={`
        group/list-item relative mb-1 flex h-full transform-gpu items-center
        gap-x-4 bg-default px-container py-4 transition-transform
        has-[a:hover]:z-30 has-[a:hover]:scale-105 has-[a:hover]:shadow-all
        has-[a:hover]:drop-shadow-2xl
        tablet:w-auto tablet:flex-col tablet:p-6
        laptop:w-auto
      `}
    >
      <div
        className={`
          transform-gpu
          after:absolute after:top-0 after:left-0 after:z-10 after:size-full
          after:rounded-[2.5px] after:bg-default after:opacity-15
          after:transition-opacity
          group-has-[a:hover]/list-item:after:opacity-0
        `}
      >
        <FluidListItemPoster
          imageProps={value.posterImageProps}
          slug={value.slug}
          title={value.title}
          year={value.year}
        />
      </div>
      <div
        className={`
          grow
          tablet:w-full
        `}
      >
        <Title slug={value.slug} title={value.title} year={value.year} />
        <div
          className={`
            flex justify-start font-sans text-xs font-light text-subtle
            tablet:justify-center
          `}
        >
          {value.count.toLocaleString()} times
        </div>
      </div>
    </li>
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
          block pt-2 font-sans text-xs leading-4 font-normal text-accent
          decoration-accent
          after:absolute after:top-0 after:left-0 after:z-10 after:size-full
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
