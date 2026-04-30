import { ListItemDetails } from "~/components/list-item-details/ListItemDetails";
import { ListItemGenres } from "~/components/list-item-genres/ListItemGenres";
import { ListItemGrade } from "~/components/list-item-grade/ListItemGrade";
import { ListItemReviewDate } from "~/components/list-item-review-date/ListItemReviewDate";
import { ListItemTitle } from "~/components/list-item-title/ListItemTitle";
import { PosterListItem } from "~/components/poster-list/PosterListItem";

import type { CollectionTitlesValue } from "./CollectionTitles";

export function CollectionTitlesListItem({
  posterHeight,
  posterWidth,
  value,
}: {
  posterHeight: number;
  posterWidth: number;
  value: CollectionTitlesValue;
}): React.JSX.Element {
  return (
    <PosterListItem
      hasReview={!!value.reviewSlug}
      posterImageProps={{
        ...value.posterSrcProps,
        height: posterHeight,
        width: posterWidth,
      }}
    >
      <ListItemDetails>
        <ListItemTitle
          reviewSlug={value.reviewSlug}
          title={value.title}
          year={value.releaseYear}
        />
        {value.grade && <ListItemGrade grade={value.grade} />}
        {value.reviewDisplayDate && (
          <ListItemReviewDate displayDate={value.reviewDisplayDate} />
        )}
        <ListItemGenres values={value.genres} />
      </ListItemDetails>
    </PosterListItem>
  );
}
