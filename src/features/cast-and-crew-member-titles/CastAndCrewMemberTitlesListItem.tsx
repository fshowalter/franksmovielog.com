import { ListItemCreditedAs } from "~/components/list-item-credited-as/ListItemCreditedAs";
import { ListItemDetails } from "~/components/list-item-details/ListItemDetails";
import { ListItemGenres } from "~/components/list-item-genres/ListItemGenres";
import { ListItemGrade } from "~/components/list-item-grade/ListItemGrade";
import { ListItemReviewDate } from "~/components/list-item-review-date/ListItemReviewDate";
import { ListItemTitle } from "~/components/list-item-title/ListItemTitle";
import { ListItemWatchlistReason } from "~/components/list-item-watchlist-reason/ListItemWatchlistReason";
import { PosterListItem } from "~/components/poster-list/PosterListItem";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";

/**
 * List item for displaying a title associated with a cast/crew member.
 * @param props - Component props
 * @param props.value - Title data including credits and review info
 * @returns List item with poster, title, credits, and review status
 */
export function CastAndCrewMemberTitleListItem({
  value,
}: {
  value: CastAndCrewMemberTitlesValue;
}): React.JSX.Element {
  return (
    <PosterListItem
      hasReview={!!value.slug}
      posterImageProps={value.posterImageProps}
    >
      <ListItemDetails>
        <ListItemTitle
          slug={value.slug}
          title={value.title}
          year={value.releaseYear}
        />
        <ListItemCreditedAs values={value.creditedAs} />
        {value.grade && <ListItemGrade grade={value.grade} />}
        {!value.grade && (
          <ListItemWatchlistReason
            collectionNames={value.watchlistCollectionNames}
            directorNames={value.watchlistDirectorNames}
            performerNames={value.watchlistPerformerNames}
            writerNames={value.watchlistWriterNames}
          />
        )}
        {value.reviewDisplayDate && (
          <ListItemReviewDate displayDate={value.reviewDisplayDate} />
        )}
        <ListItemGenres values={value.genres} />
      </ListItemDetails>
    </PosterListItem>
  );
}
