import type { PosterImageProps } from "~/api/posters";

import { Grade } from "~/components/Grade";
import { ListItem } from "~/components/ListItem";
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
  reviewDisplayDate: string;
  slug: string;
  sortTitle: string;
  title: string;
  year: string;
};

export function ReviewListItem({ value }: { value: ReviewListItemValue }) {
  return (
    <ListItem
      className={`
        group/list-item relative transform-gpu transition-transform
        tablet-landscape:has-[a:hover]:z-30
        tablet-landscape:has-[a:hover]:scale-105
        tablet-landscape:has-[a:hover]:shadow-all
        tablet-landscape:has-[a:hover]:drop-shadow-2xl
      `}
    >
      <div
        className={`
          relative
          after:absolute after:top-0 after:left-0 after:z-10 after:size-full
          after:bg-default after:opacity-15 after:transition-opacity
          group-has-[a:hover]/list-item:after:opacity-0
        `}
      >
        <ListItemPoster imageProps={value.posterImageProps} />
      </div>
      <div
        className={`
          flex grow flex-col items-start gap-y-2
          tablet:w-full
          laptop:pr-4
        `}
      >
        <ListItemTitle
          slug={value.slug}
          title={value.title}
          year={value.year}
        />
        <Grade className="mb-1" height={16} value={value.grade} />
        <div className="font-sans text-xs leading-4 font-light text-subtle">
          {value.reviewDisplayDate}
        </div>
        <ListItemGenres values={value.genres} />
      </div>
    </ListItem>
  );
}
