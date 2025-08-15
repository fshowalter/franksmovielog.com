import type { PosterImageProps } from "~/api/posters";

import { Grade } from "~/components/Grade";
import { ListItemGenres } from "~/components/ListItemGenres";
import { ListItemTitle } from "~/components/ListItemTitle";
import { PosterListItem } from "~/components/PosterList";

export type ReviewsListItemValue = {
  genres: string[];
  grade: string;
  gradeValue: number;
  imdbId: string;
  posterImageProps: PosterImageProps;
  releaseSequence: string;
  releaseYear: string;
  reviewDisplayDate: string;
  reviewMonth?: string;
  reviewSequence: string;
  reviewYear: string;
  slug: string;
  sortTitle: string;
  title: string;
};

export function ReviewsListItem({ value }: { value: ReviewsListItemValue }) {
  return (
    <PosterListItem posterImageProps={value.posterImageProps}>
      <div
        className={`
          flex grow flex-col items-start gap-y-2
          tablet:mt-2 tablet:w-full tablet:px-1
        `}
      >
        <ListItemTitle
          slug={value.slug}
          title={value.title}
          year={value.releaseYear}
        />
        <Grade className="mb-1" height={16} value={value.grade} />
        <div
          className={`
            font-sans text-xs leading-4 font-light text-subtle
            tablet:text-xxs
          `}
        >
          {value.reviewDisplayDate}
        </div>
        <ListItemGenres values={value.genres} />
      </div>
    </PosterListItem>
  );
}
