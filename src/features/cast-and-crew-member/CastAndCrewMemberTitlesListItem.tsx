import { ListItemCreditedAs } from "~/components/list-item-credited-as/ListItemCreditedAs";
import { ListItemDetails } from "~/components/list-item-details/ListItemDetails";
import { ListItemGenres } from "~/components/list-item-genres/ListItemGenres";
import { ListItemGrade } from "~/components/list-item-grade/ListItemGrade";
import { ListItemReviewDate } from "~/components/list-item-review-date/ListItemReviewDate";
import { ListItemTitle } from "~/components/list-item-title/ListItemTitle";
import { ListItemWatchlistReason } from "~/components/list-item-watchlist-reason/ListItemWatchlistReason";
import { PosterListItem } from "~/components/poster-list/PosterListItem";

import type { CastAndCrewMemberTitlesValue } from "./CastAndCrewMemberTitles";

export function CastAndCrewMemberTitlesListItem({
  value,
}: {
  value: CastAndCrewMemberTitlesValue;
}): React.JSX.Element {
  return (
    <PosterListItem
      hasReview={Boolean(value.reviewSlug)}
      posterImageProps={value.posterImageProps}
    >
      <ListItemDetails>
        <ListItemCreditedAs values={value.creditedAs} />
        <ListItemTitle
          reviewSlug={value.reviewSlug}
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
