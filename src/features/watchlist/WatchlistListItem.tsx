import type { PosterImageProps } from "~/api/posters";

import { ListItemDetails } from "~/components/list-item-details/ListItemDetails";
import { ListItemGenres } from "~/components/list-item-genres/ListItemGenres";
import { ListItemTitle } from "~/components/list-item-title/ListItemTitle";
import { ListItemWatchlistReason } from "~/components/list-item-watchlist-reason/ListItemWatchlistReason";
import { PosterListItem } from "~/components/poster-list/PosterListItem";

import type { WatchlistValue } from "./Watchlist";

/**
 * List item component for displaying a single watchlist entry.
 * @param props - Component props
 * @param props.defaultPosterImageProps - Default poster image to use
 * @param props.value - Watchlist entry data to display
 * @returns Watchlist item with poster, title, and reason for inclusion
 */
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
