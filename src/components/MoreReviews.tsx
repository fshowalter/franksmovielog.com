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
  slug: string;
  stillImageProps: StillImageProps;
  title: string;
  year: string;
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
      <div className="relative mx-auto w-full max-w-screen-max px-container desktop:px-20">
        {children}
        <ul className="flex w-full flex-col gap-[3%] gap-y-[6vw] tablet:flex-row tablet:flex-wrap tablet:justify-between desktop:flex-nowrap">
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
    <li className="relative w-full tablet:w-[47%]">
      <div className="block">
        <Still
          imageProps={value.stillImageProps}
          {...MoreReviewsImageConfig}
          className="h-auto w-full"
          decoding="async"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col bg-default px-6 pb-4 pt-6 desktop:pl-[12%] desktop:pr-[14%]">
        <a
          className="mb-3 block text-xl font-medium leading-6 text-default before:absolute before:inset-x-0 before:top-0 before:aspect-video before:bg-[#fff] before:opacity-15 hover:text-accent hover:before:opacity-0"
          href={`/reviews/${value.slug}/`}
        >
          {value.title}&nbsp;
          <span className="text-sm font-normal leading-none text-muted">
            {value.year}
          </span>
        </a>
        <Grade className="mb-4" height={18} value={value.grade} />
        <RenderedMarkdown
          className="mb-8 text-base leading-[1.6] tracking-prose text-muted"
          text={value.excerpt}
        />
        <div className="font-sans text-xxs font-light leading-4 tracking-wider text-subtle desktop:tracking-wide">
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
