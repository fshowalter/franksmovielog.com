import type { PosterImageProps } from "src/api/posters";
import { ccn } from "src/utils/concatClassNames";

import { Poster } from "./Poster";

export const MostWatchedMoviesPosterConfig = {
  width: 248,
  height: 372,
  sizes:
    "(max-width: 767px) 64px, (max-width: 1279px) 128px, (min-width: 784px) 20vw, 248px",
};

export interface MostWatchedMoviesListItemValue {
  imdbId: string;
  title: string;
  year: string;
  slug: string | null;
  count: number;
  posterImageProps: PosterImageProps;
}

export function MostWatchedMovies({
  values,
  className,
}: {
  values: readonly MostWatchedMoviesListItemValue[];
  className?: string;
}): JSX.Element | null {
  if (values.length === 0) {
    return null;
  }

  return (
    <section
      className={ccn("bg-default px-container desktop:pb-10", className)}
    >
      <h2 className="py-4 font-medium shadow-bottom tablet:text-center tablet:text-2xl desktop:py-8">
        Most Watched Movies
      </h2>
      <List>
        {values.map((value) => {
          return <ListItem value={value} key={value.imdbId} />;
        })}
      </List>
    </section>
  );
}

function List({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ol className="grid-cols-[repeat(auto-fit,_minmax(128px,_min(calc(100%_/_5_-_24px),248px)))] items-center justify-center gap-x-6 gap-y-8 bg-subtle tablet:grid tablet:items-start tablet:bg-default">
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
        title={value.title}
        year={value.year}
        slug={value.slug}
        imageProps={value.posterImageProps}
        className="shrink-0"
      />
      <div className="grow tablet:w-full">
        <Title title={value.title} year={value.year} slug={value.slug} />
        <div className="flex justify-start font-sans text-xs font-light text-subtle tablet:justify-center tablet:text-sm">
          {value.count.toLocaleString()} times
        </div>
      </div>
    </li>
  );
}

export function Title({
  title,
  year,
  slug,
}: {
  title: string;
  year: string;
  slug?: string | null;
}) {
  const yearBox = (
    <span className="text-xxs font-light text-subtle tablet:text-xs">
      {year}
    </span>
  );

  if (slug) {
    return (
      <a
        href={`/reviews/${slug}/`}
        className="block font-sans text-sm font-medium text-accent decoration-accent decoration-2 underline-offset-4 before:absolute before:left-[var(--container-padding)] before:top-4 before:aspect-poster before:w-list-item-poster before:bg-[#fff] before:opacity-15 hover:underline hover:before:opacity-0 tablet:text-center tablet:before:left-0 tablet:before:top-0 tablet:before:w-full"
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

function FluidListItemPoster({
  className,
  imageProps,
}: {
  title: string;
  slug: string | null;
  year: string;
  className?: string;
  imageProps: PosterImageProps;
}) {
  return (
    <div className={ccn("min-w-12 max-w-12 tablet:max-w-[248px]", className)}>
      <Poster
        imageProps={imageProps}
        width={MostWatchedMoviesPosterConfig.width}
        height={MostWatchedMoviesPosterConfig.height}
        sizes={MostWatchedMoviesPosterConfig.sizes}
        loading="lazy"
        decoding="async"
        className="h-auto"
      />
    </div>
  );
}
