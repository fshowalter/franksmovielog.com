import type { BackdropImageProps } from "~/api/backdrops";

import { getBackdropImageProps } from "~/api/backdrops";
import { getFixedWidthPosterImageProps } from "~/api/posters";
import { allWatchlistTitles } from "~/api/watchlistTitles";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemPosterImageConfig } from "~/components/ListItemPoster";

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
    distinctPerformers,
    distinctReleaseYears,
    distinctWriters,
    watchlistTitles,
  } = await allWatchlistTitles();

  const defaultPosterImageProps = await getFixedWidthPosterImageProps(
    "default",
    ListItemPosterImageConfig,
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
    distinctPerformers,
    distinctReleaseYears,
    distinctWriters,
    initialSort: "release-date-asc",
    metaDescription:
      "My to-review bucket list. See what I've yet to review. Sort or filter titles by reason, release date, or title.",
    values: watchlistTitles,
  };
}
