import { getBackdropImageProps } from "~/api/backdrops";
import { getFixedWidthPosterImageProps } from "~/api/posters";
import { allWatchlistTitles } from "~/api/watchlistTitles";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemPosterImageConfig } from "~/components/ListItemPoster";

import type { Props } from "./Watchlist";

export async function getProps(): Promise<Props & { metaDescription: string }> {
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

  watchlistTitles.sort((a, b) =>
    a.releaseSequence.localeCompare(b.releaseSequence),
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
