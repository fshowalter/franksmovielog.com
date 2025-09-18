import type { PosterImageProps } from "~/api/posters";

import { ListItemDetails } from "~/components/list-item-details/ListItemDetails";
import { ListItemGenres } from "~/components/list-item-genres/ListItemGenres";
import { ListItemGrade } from "~/components/list-item-grade/ListItemGrade";
import { ListItemReviewDate } from "~/components/list-item-review-date/ListItemReviewDate";
import { ListItemTitle } from "~/components/list-item-title/ListItemTitle";
import { PosterListItem } from "~/components/poster-list/PosterListItem";

export type ReviewsValue = {
  genres: string[];
  grade: string;
  gradeValue: number;
  imdbId: string;
  posterImageProps: PosterImageProps;
  releaseSequence: number;
  releaseYear: string;
  reviewDisplayDate: string;
  reviewMonth?: string;
  reviewSequence: number;
  reviewYear: string;
  slug: string;
  sortTitle: string;
  title: string;
};

/**
 * List item component for displaying a single review.
 * @param props - Component props
 * @param props.value - Review data to display
 * @returns Review list item with poster, title, grade, and details
 */
export function ReviewsListItem({
  value,
}: {
  value: ReviewsValue;
}): React.JSX.Element {
  return (
    <PosterListItem posterImageProps={value.posterImageProps}>
      <ListItemDetails>
        <ListItemTitle
          slug={value.slug}
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
