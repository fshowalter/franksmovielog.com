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
  | "date"
  | "directorNames"
  | "genres"
  | "grade"
  | "imdbId"
  | "principalCastNames"
  | "sequence"
  | "slug"
  | "title"
  | "year"
> &
  ReviewExcerpt & {
    stillImageProps: StillImageProps;
  };

export function HomeListItem({ value }: { value: ListItemValue }) {
  return (
    <li className="relative mb-1 flex flex-col bg-default pt-12 has-[a:hover]:bg-[var(--bg-hover)] tablet:mb-0 tablet:max-w-[47%] tablet:pt-0 desktop:max-w-[31.33%]">
      <div className="mx-[8%] mb-6 block tablet:mx-0">
        <Still
          imageProps={value.stillImageProps}
          {...StillImageConfig}
          className="h-auto w-full"
          decoding="async"
          loading="lazy"
        />
      </div>
      <div className="flex grow flex-col px-[8%] pb-8 desktop:pl-[8.5%] desktop:pr-[10%]">
        <div className="mb-3 font-sans text-xxs font-light uppercase leading-4 tracking-wider text-subtle desktop:tracking-wide">
          {formatDate(value.date)}
        </div>
        <a
          className="mb-3 block text-2.5xl font-medium leading-7 before:absolute before:inset-x-[8%] before:top-12 before:aspect-video before:bg-[#fff] before:opacity-15 after:absolute after:left-0 after:top-0 after:size-full hover:text-accent hover:before:opacity-0 tablet:before:inset-x-0 tablet:before:top-0"
          href={`/reviews/${value.slug}/`}
        >
          {value.title}&nbsp;
          <span className="text-sm font-normal leading-none text-muted">
            {value.year}
          </span>
        </a>
        <Grade className="mb-5 tablet:mb-8" height={24} value={value.grade} />
        <RenderedMarkdown
          className="mb-6 text-lg leading-normal tracking-prose text-muted"
          text={value.excerpt}
        />
        <div className="mt-auto font-sans text-xxs font-light leading-4 tracking-wider text-subtle desktop:tracking-wide">
          {value.genres.map((genre, index) => {
            if (index === 0) {
              return <span key={genre}>{genre}</span>;
            }

            return <span key={genre}> | {genre}</span>;
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
