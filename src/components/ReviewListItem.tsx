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
        group/list-item relative mb-1 flex max-w-(--breakpoint-desktop)
        transform-gpu flex-row gap-x-[5%] bg-default px-container py-4
        transition-transform
        tablet:flex-col tablet:bg-transparent tablet:px-6 tablet:py-6
        tablet:has-[a:hover]:-translate-y-2 tablet:has-[a:hover]:bg-default
        tablet:has-[a:hover]:drop-shadow-2xl
      `}
    >
      <div
        className={`
          relative w-1/4 max-w-[250px] transition-transform
          after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
          after:bg-default after:opacity-15 after:transition-opacity
          group-has-[a:hover]/list-item:after:opacity-0
          tablet:w-auto
        `}
      >
        <ListItemPoster imageProps={value.posterImageProps} />
      </div>
      <div
        className={`
          flex grow flex-col items-start gap-y-2
          tablet:mt-2 tablet:w-full
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
    </li>
  );
}
