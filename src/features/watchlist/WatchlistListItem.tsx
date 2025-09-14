import type { PosterImageProps } from "~/api/posters";

import { ListItemDetails } from "~/components/ListItemDetails";
import { ListItemGenres } from "~/components/ListItemGenres";
import { ListItemTitle } from "~/components/ListItemTitle";
import { ListItemWatchlistReason } from "~/components/ListItemWatchlistReason";
import { PosterListItem } from "~/components/PosterList";

import type { WatchlistValue } from "./Watchlist";

export function WatchlistListItem({
  defaultPosterImageProps,
  value,
}: {
  defaultPosterImageProps: PosterImageProps;
  value: WatchlistValue;
}): React.JSX.Element {
  return (
    <PosterListItem
      hasReview={false}
      posterImageProps={defaultPosterImageProps}
    >
      <ListItemDetails>
        <ListItemTitle
          className={`[--list-item-title-unreviewed-color:var(--fg-muted)]`}
          title={value.title}
          year={value.releaseYear}
        />
        <ListItemWatchlistReason
          collectionNames={value.watchlistCollectionNames}
          directorNames={value.watchlistDirectorNames}
          performerNames={value.watchlistPerformerNames}
          writerNames={value.watchlistWriterNames}
        />
        <ListItemGenres values={value.genres} />
      </ListItemDetails>
    </PosterListItem>
  );
}
