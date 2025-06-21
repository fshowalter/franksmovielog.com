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
  slug: string;
  sortTitle: string;
  title: string;
  year: string;
};

export function ReviewListItem({ value }: { value: ReviewListItemValue }) {
  return (
    <ListItem className="has-[a:hover]:bg-hover has-[a:hover]:shadow-hover">
      <ListItemPoster imageProps={value.posterImageProps} />
      <div
        className={`
          flex grow flex-col items-start gap-y-2
          tablet:w-full
          desktop:pr-4
        `}
      >
        <ListItemTitle
          slug={value.slug}
          title={value.title}
          year={value.year}
        />
        <Grade className="mb-1" height={16} value={value.grade} />
        <ListItemGenres values={value.genres} />
      </div>
    </ListItem>
  );
}
