import type { PosterImageProps } from "src/api/posters";
import { ccn } from "src/utils/concatClassNames";

import { ListItemTitle } from "./ListItemTitle";
import { Poster } from "./Poster";

export const MostWatchedMoviesPosterConfig = {
  width: 250,
  height: 375,
  sizes:
    "(min-width: 510px) 33vw, (min-width: 633px) 25vw, (min-width: 784px) 20vw, (min-width: 936px) 16vw, 48px",
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
      <h2 className="py-4 font-medium shadow-bottom tablet:text-center desktop:py-8 desktop:text-2xl">
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
    <ol className="grid-cols-[repeat(auto-fill,_minmax(128px,_min(calc(100%_/_5_-_24px),250px)))] items-center justify-center gap-x-6 gap-y-8 bg-subtle tablet:flex tablet:flex-wrap tablet:bg-default">
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
    <li className="mb-1 flex items-center gap-x-6 bg-default py-4 tablet:w-32 tablet:flex-col tablet:p-0 desktop:w-auto">
      <FluidListItemPoster
        title={value.title}
        year={value.year}
        slug={value.slug}
        imageProps={value.posterImageProps}
        className="shrink-0"
      />
      <div className="grow tablet:w-full">
        <div className="tablet:hidden">
          <ListItemTitle
            title={value.title}
            year={value.year}
            slug={value.slug}
          />
        </div>
        <div className="flex justify-start font-sans-narrow text-sm text-subtle tablet:justify-center desktop:text-base">
          <div>{value.count.toLocaleString()} times</div>
        </div>
      </div>
    </li>
  );
}

function FluidListItemPoster({
  title,
  slug,
  year,
  className,
  imageProps,
}: {
  title: string;
  slug: string | null;
  year: string;
  className?: string;
  imageProps: PosterImageProps;
}) {
  if (slug) {
    return (
      <a
        href={`/reviews/${slug}/`}
        className={ccn(
          "w-full min-w-12 max-w-12 tablet:max-w-poster",
          className,
        )}
      >
        <Poster
          imageProps={imageProps}
          title={title}
          year={year}
          width={MostWatchedMoviesPosterConfig.width}
          height={MostWatchedMoviesPosterConfig.height}
          sizes={MostWatchedMoviesPosterConfig.sizes}
          loading="lazy"
          decoding="async"
        />
      </a>
    );
  }

  return (
    <div className={ccn("min-w-12 max-w-12 tablet:max-w-poster", className)}>
      <Poster
        imageProps={imageProps}
        title={title}
        year={year}
        width={MostWatchedMoviesPosterConfig.width}
        height={MostWatchedMoviesPosterConfig.height}
        sizes={MostWatchedMoviesPosterConfig.sizes}
        loading="lazy"
        decoding="async"
        className="h-auto"
        alt={`${title} (${year})`}
      />
    </div>
  );
}
