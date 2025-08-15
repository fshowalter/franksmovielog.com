import type { JSX } from "react";

import type { PosterImageProps } from "~/api/posters";

import { ccn } from "~/utils/concatClassNames";

import { Poster } from "./Poster";

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
    <div className={ccn(``, className)}>
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
        justify-center gap-y-8 bg-subtle
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
        gap-x-4 px-container py-4 transition-transform
        has-[a:hover]:bg-default
        tablet:w-auto tablet:flex-col tablet:p-6
        tablet-landscape:has-[a:hover]:z-hover
        tablet-landscape:has-[a:hover]:scale-105
        tablet-landscape:has-[a:hover]:shadow-all
        tablet-landscape:has-[a:hover]:drop-shadow-2xl
        laptop:w-auto
      `}
    >
      <div
        className={`
          w-1/4 shrink-0 transform-gpu
          after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
          after:rounded-[2.5px] after:bg-default after:opacity-15
          after:transition-opacity
          group-has-[a:hover]/list-item:after:opacity-0
          tablet:w-auto tablet:max-w-[248px]
        `}
      >
        <FluidListItemPoster
          imageProps={value.posterImageProps}
          slug={value.slug}
          title={value.title}
          year={value.releaseYear}
        />
      </div>
      <div className={`tablet:w-full`}>
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
