import type { Review, ReviewExcerpt } from "~/api/reviews";
import type { StillImageProps } from "~/api/stills";

import { Grade } from "~/components/Grade";
import { RenderedMarkdown } from "~/components/RenderedMarkdown";
import { Still } from "~/components/Still";

export const StillImageConfig = {
  height: 360,
  sizes:
    "(min-width: 1800px) 481px, (min-width: 1280px) calc(26vw + 18px), (min-width: 780px) calc(47.08vw - 46px), 83.91vw",
  width: 640,
};

export type ListItemValue = Pick<
  Review,
  | "directorNames"
  | "genres"
  | "grade"
  | "imdbId"
  | "principalCastNames"
  | "releaseYear"
  | "reviewDate"
  | "reviewSequence"
  | "slug"
  | "title"
> &
  ReviewExcerpt & {
    stillImageProps: StillImageProps;
  };

export function HomeListItem({ value }: { value: ListItemValue }) {
  return (
    <li
      className={`
        group/list-item relative mb-1 flex transform-gpu flex-col bg-default
        px-[8%] pt-12 transition-transform duration-500
        tablet:mb-0 tablet:max-w-[47%] tablet:px-0 tablet:pt-0
        tablet-landscape:has-[a:hover]:scale-105
        tablet-landscape:has-[a:hover]:drop-shadow-2xl
        laptop:max-w-[31.33%]
      `}
    >
      <div
        className={`
          relative mb-6 block overflow-hidden
          after:absolute after:top-0 after:left-0 after:aspect-video
          after:size-full after:bg-default after:opacity-15 after:duration-500
          group-has-[a:hover]/list-item:after:opacity-0
          tablet:after:inset-x-0 tablet:after:top-0
        `}
      >
        <Still
          imageProps={value.stillImageProps}
          {...StillImageConfig}
          className={`
            h-auto w-full transform-gpu transition-transform duration-500
            group-has-[a:hover]/list-item:scale-105
          `}
          decoding="async"
          loading="lazy"
        />
      </div>
      <div
        className={`
          flex grow flex-col px-1 pb-8
          tablet:px-[8%]
          laptop:pr-[10%] laptop:pl-[8.5%]
        `}
      >
        <div
          className={`
            mb-3 font-sans text-xs leading-4 font-normal tracking-wider
            text-subtle uppercase
            laptop:tracking-wide
          `}
        >
          {formatDate(value.reviewDate)}
        </div>
        <a
          className={`
            mb-3 block text-2.5xl leading-7 font-medium text-[#252525]
            transition-all duration-500
            after:absolute after:top-0 after:left-0 after:z-sticky
            after:size-full
            hover:text-accent
          `}
          href={`/reviews/${value.slug}/`}
        >
          {value.title}&nbsp;
          <span className="text-sm leading-none font-normal text-muted">
            {value.releaseYear}
          </span>
        </a>
        <Grade
          className={`
            mb-5
            tablet:mb-8
          `}
          height={24}
          value={value.grade}
        />
        <RenderedMarkdown
          className="leading-normal mb-6 text-lg tracking-prose text-muted"
          text={value.excerpt}
        />
        <div
          className={`
            mt-auto font-sans text-xs leading-4 tracking-wider text-subtle
            laptop:tracking-wide
          `}
        >
          {value.genres.map((genre, index) => {
            if (index === 0) {
              return <span key={genre}>{genre}</span>;
            }

            return <span key={genre}>, {genre}</span>;
          })}
        </div>
      </div>
    </li>
  );
}

function formatDate(reviewDate: Date) {
  return reviewDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  });
}
