import type { BackdropImageProps } from "~/api/backdrops";

import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { allWatchlistTitles } from "~/api/watchlist-titles";
import { BackdropImageConfig } from "~/components/Backdrop";
import { PosterListItemImageConfig } from "~/components/PosterList";

import type { Props } from "./Watchlist";

type PageProps = Props & {
  backdropImageProps: BackdropImageProps;
  deck: string;
  metaDescription: string;
};

export async function getProps(): Promise<PageProps> {
  const {
    distinctCollections,
    distinctDirectors,
    distinctGenres,
    distinctPerformers,
    distinctReleaseYears,
    distinctWriters,
    watchlistTitles,
  } = await allWatchlistTitles();

  const defaultPosterImageProps = await getFluidWidthPosterImageProps(
    "default",
    PosterListItemImageConfig,
  );

  return {
    backdropImageProps: await getBackdropImageProps(
      "watchlist",
      BackdropImageConfig,
    ),
    deck: `"A man's got to know his limitations"`,
    defaultPosterImageProps,
    distinctCollections,
    distinctDirectors,
    distinctGenres,
    distinctPerformers,
    distinctReleaseYears,
    distinctWriters,
    initialSort: "title-asc",
    metaDescription:
      "My to-review bucket list. See what I've yet to review. Sort or filter titles by reason, release date, or title.",
    values: watchlistTitles,
  };
}
