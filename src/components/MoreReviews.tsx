import type { JSX } from "react";

import type { StillImageProps } from "~/api/stills";

import { Grade } from "./Grade";
import { RenderedMarkdown } from "./RenderedMarkdown";
import { Still } from "./Still";

export const MoreReviewsImageConfig = {
  height: 360,
  sizes:
    "(max-width: 767px) 84vw, (max-width: 1279px) calc((100vw - 96px) * 0.47), (max-width: 1695px) calc((100vw - 160px) * .22735), 350px",
  width: 640,
};

export type MoreReviewsValue = {
  excerpt: string;
  genres: string[];
  grade: string;
  releaseYear: string;
  slug: string;
  stillImageProps: StillImageProps;
  title: string;
};

export function MoreReviews({
  children,
  values,
}: {
  children: React.ReactNode;
  values: MoreReviewsValue[];
}): JSX.Element {
  return (
    <nav data-pagefind-ignore>
      <div
        className={`
          relative mx-auto w-full max-w-(--breakpoint-desktop) px-container
          laptop:px-20
        `}
      >
        {children}
        <ul
          className={`
            flex w-full flex-col gap-[3%] gap-y-[6vw]
            tablet:flex-row tablet:flex-wrap tablet:justify-between
            laptop:flex-nowrap
          `}
        >
          {values.map((value) => {
            return <MoreReviewsCard key={value.slug} value={value} />;
          })}
        </ul>
      </div>
    </nav>
  );
}

function MoreReviewsCard({ value }: { value: MoreReviewsValue }) {
  return (
    <li
      className={`
        group/list-item relative w-full transform-gpu transition-transform
        has-[a:hover]:-translate-y-1 has-[a:hover]:scale-105
        has-[a:hover]:drop-shadow-2xl
        tablet:w-[47%]
      `}
    >
      <div className={`bg-default`}>
        <div
          className={`
            block
            after:absolute after:inset-x-0 after:top-0 after:aspect-video
            after:bg-default after:opacity-15
            group-has-[a:hover]/list-item:after:opacity-0
          `}
        >
          <Still
            imageProps={value.stillImageProps}
            {...MoreReviewsImageConfig}
            className="h-auto w-full"
            decoding="async"
            loading="lazy"
          />
        </div>
        <div
          className={`
            flex flex-col px-6 pt-6 pb-6
            laptop:pr-[14%] laptop:pl-[12%]
          `}
        >
          <a
            className={`
              mb-3 block text-xl leading-6 font-medium text-default
              after:absolute after:top-0 after:left-0 after:z-sticky
              after:size-full after:opacity-0
              hover:text-accent hover:before:opacity-0
            `}
            href={`/reviews/${value.slug}/`}
          >
            {value.title}&nbsp;
            <span className="text-sm leading-none font-normal text-muted">
              {value.releaseYear}
            </span>
          </a>
          <Grade className="mb-4" height={18} value={value.grade} />
          <RenderedMarkdown
            className="mb-8 text-base leading-[1.6] tracking-prose text-muted"
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
      </div>
    </li>
  );
}
