import type { PosterImageProps } from "~/api/posters";

import { ListItemTitle } from "~/components/list-item-title/ListItemTitle";
import { PosterList } from "~/components/poster-list/PosterList";
import { PosterListItem } from "~/components/poster-list/PosterListItem";

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
  className: string;
  values: readonly MostWatchedMoviesListItemValue[];
}): false | React.JSX.Element {
  if (values.length === 0) {
    return false;
  }

  return (
    <section
      className={`
        max-w-[calc(250px_*_4)] pb-5
        laptop:pb-10
        desktop:max-w-[calc(298px_*_4)]
        ${className}
      `}
    >
      <h2
        className={`
          px-container py-4 text-xl font-medium
          tablet:text-center tablet:text-2xl
          laptop:py-8
        `}
      >
        Most Watched Movies
      </h2>
      <PosterList className={`justify-center`}>
        {values.map((value) => {
          return <ListItem key={value.imdbId} value={value} />;
        })}
      </PosterList>
    </section>
  );
}

function ListItem({
  value,
}: {
  value: MostWatchedMoviesListItemValue;
}): React.JSX.Element {
  return (
    <PosterListItem posterImageProps={value.posterImageProps}>
      <div
        className={`
          flex flex-col justify-center
          tablet:mt-2 tablet:w-full tablet:text-center
        `}
      >
        <ListItemTitle
          slug={value.slug}
          title={value.title}
          year={value.releaseYear}
        />
        <div
          className={`
            mt-1 flex justify-start font-sans text-[13px] font-normal
            text-subtle
            tablet:justify-center
          `}
        >
          {value.count.toLocaleString()} times
        </div>
      </div>
    </PosterListItem>
  );
}
