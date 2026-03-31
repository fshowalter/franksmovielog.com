import { ListItemDetails } from "~/components/list-item-details/ListItemDetails";
import { ListItemGenres } from "~/components/list-item-genres/ListItemGenres";
import { ListItemGrade } from "~/components/list-item-grade/ListItemGrade";
import { ListItemReviewDate } from "~/components/list-item-review-date/ListItemReviewDate";
import { ListItemTitle } from "~/components/list-item-title/ListItemTitle";
import { PosterListItem } from "~/components/poster-list/PosterListItem";

import type { ReviewsValue } from "./Reviews";

export function ReviewsListItem({
  value,
}: {
  value: ReviewsValue;
}): React.JSX.Element {
  return (
    <PosterListItem posterImageProps={value.posterImageProps}>
      <ListItemDetails>
        <ListItemTitle
          reviewSlug={value.slug}
          title={value.title}
          year={value.releaseYear}
        />
        <ListItemGrade grade={value.grade} />
        <ListItemReviewDate displayDate={value.reviewDisplayDate} />
        <ListItemGenres values={value.genres} />
      </ListItemDetails>
    </PosterListItem>
  );
}
