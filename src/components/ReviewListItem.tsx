import type { PosterImageProps } from "~/api/posters";

import { Grade } from "~/components/Grade";
import { ListItemGenres } from "~/components/ListItemGenres";
import { ListItemPoster } from "~/components/ListItemPoster";
import { ListItemTitle } from "~/components/ListItemTitle";

export type ReviewListItemValue = {
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

export function ReviewListItem({ value }: { value: ReviewListItemValue }) {
  return (
    <li
      className={`
        group/list-item relative
        tablet-landscape:flex-col
      `}
    >
      <div
        className={`
          relative transition-transform
          after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
          after:bg-default after:opacity-15 after:transition-opacity
          group-has-[a:hover]/list-item:after:opacity-0
          tablet-landscape:group-has-[a:hover]/list-item:-translate-y-2
        `}
      >
        <ListItemPoster imageProps={value.posterImageProps} />
      </div>
      <div
        className={`
          flex grow flex-col items-start gap-y-2
          tablet:w-full
          tablet-landscape:mt-2
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
            tablet-landscape:text-xxs
          `}
        >
          {value.reviewDisplayDate}
        </div>
        <ListItemGenres values={value.genres} />
      </div>
    </li>
  );
}
