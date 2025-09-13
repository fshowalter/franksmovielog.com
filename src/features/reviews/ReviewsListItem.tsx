import type { PosterImageProps } from "~/api/posters";

import { ListItemDetails } from "~/components/ListItemDetails";
import { ListItemGenres } from "~/components/ListItemGenres";
import { ListItemGrade } from "~/components/ListItemGrade";
import { ListItemReviewDate } from "~/components/ListItemReviewDate";
import { ListItemTitle } from "~/components/ListItemTitle";
import { PosterListItem } from "~/components/PosterList";

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

export function ReviewsListItem({
  value,
}: {
  value: ReviewsListItemValue;
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
