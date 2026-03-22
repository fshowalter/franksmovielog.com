import { ListItemDetails } from "~/components/list-item-details/ListItemDetails";
import { ListItemGenres } from "~/components/list-item-genres/ListItemGenres";
import { ListItemGrade } from "~/components/list-item-grade/ListItemGrade";
import { ListItemReviewDate } from "~/components/list-item-review-date/ListItemReviewDate";
import { ListItemTitle } from "~/components/list-item-title/ListItemTitle";
import { ListItemWatchlistReason } from "~/components/list-item-watchlist-reason/ListItemWatchlistReason";
import { PosterListItem } from "~/components/poster-list/PosterListItem";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";

/**
 * List item for displaying a title within a collection.
 * @param props - Component props
 * @param props.value - Title data including review info if reviewed
 * @returns List item with poster, title, grade, and details
 */
export function CastAndCrewMemberTitlesListItem({
  value,
}: {
  value: CastAndCrewMemberTitlesValue;
}): React.JSX.Element {
  return (
    <PosterListItem
      hasReview={!!value.reviewSlug}
      posterImageProps={value.posterImageProps}
    >
      <ListItemDetails>
        <ListItemTitle
          slug={value.reviewSlug}
          title={value.title}
          year={value.releaseYear}
        />
        {value.grade && value.reviewDisplayDate ? (
          <>
            <ListItemGrade grade={value.grade} />
            <ListItemReviewDate displayDate={value.reviewDisplayDate} />
          </>
        ) : (
          <div className="mb-1">
            <ListItemWatchlistReason
              collectionNames={value.watchlistCollectionNames}
              directorNames={value.watchlistDirectorNames}
              performerNames={value.watchlistPerformerNames}
              writerNames={value.watchlistWriterNames}
            />
          </div>
        )}
        <ListItemGenres values={value.genres} />
      </ListItemDetails>
    </PosterListItem>
  );
}
