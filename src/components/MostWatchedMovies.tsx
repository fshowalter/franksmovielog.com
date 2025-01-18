import type { JSX } from "react";

import type { PosterImageProps } from "~/api/posters";

import { ccn } from "~/utils/concatClassNames";

import { Poster } from "./Poster";

export const MostWatchedMoviesPosterConfig = {
  height: 372,
  sizes:
    "(max-width: 767px) 64px, (max-width: 1279px) 128px, (min-width: 784px) 20vw, 248px",
  width: 248,
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
      className={ccn("bg-default px-container desktop:pb-10", className)}
    >
      <h2 className="py-4 text-xl font-medium shadow-bottom tablet:text-center tablet:text-2xl desktop:py-8">
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
    <div className={ccn("w-16 tablet:w-auto tablet:max-w-[248px]", className)}>
      <Poster
        className="h-auto"
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
    <ol className="grid-cols-[repeat(auto-fit,_minmax(128px,248px))] items-center justify-center gap-x-6 gap-y-8 bg-subtle tablet:grid tablet:items-start tablet:bg-default">
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
    <li className="relative mb-1 flex items-center gap-x-6 bg-default py-4 tablet:w-auto tablet:flex-col tablet:p-0 desktop:w-auto">
      <FluidListItemPoster
        imageProps={value.posterImageProps}
        slug={value.slug}
        title={value.title}
        year={value.year}
      />
      <div className="grow tablet:w-full">
        <Title slug={value.slug} title={value.title} year={value.year} />
        <div className="flex justify-start font-sans text-xs font-light text-subtle tablet:justify-center tablet:text-sm">
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
    <span className="text-xxs font-light text-subtle tablet:text-xs">
      {year}
    </span>
  );

  if (slug) {
    return (
      <a
        className="block font-sans text-sm font-medium text-accent decoration-accent decoration-2 before:absolute before:left-0 before:top-4 before:aspect-poster before:w-list-item-poster before:bg-default before:opacity-15 hover:before:opacity-0 tablet:text-center tablet:before:top-0 tablet:before:w-full"
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
    <span className="block font-sans text-sm font-normal text-muted tablet:text-center">
      {title}
      {"\u202F"}
      {"\u202F"}
      {yearBox}
    </span>
  );
}
