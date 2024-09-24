import type { StillImageProps } from "src/api/stills";

import { Grade } from "./Grade";
import { RenderedMarkdown } from "./RenderedMarkdown";
import { Still } from "./Still";

export const MoreReviewsImageConfig = {
  width: 640,
  height: 360,
  sizes:
    "(max-width: 767px) 84vw, (max-width: 1279px) calc((100vw - 96px) * 0.47), (max-width: 1695px) calc((100vw - 160vw) * .22735), 350px",
};

export interface MoreReviewsValue {
  title: string;
  grade: string;
  slug: string;
  year: string;
  excerpt: string;
  genres: string[];
  stillImageProps: StillImageProps;
}

export function MoreReviews({
  values,
  children,
}: {
  values: MoreReviewsValue[];
  children: React.ReactNode;
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
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex flex-col bg-default px-6 pb-4 pt-6 desktop:pl-[12%] desktop:pr-[14%]">
        <a
          href={`/reviews/${value.slug}/`}
          className="mb-4 block text-xl font-medium text-default before:absolute before:inset-x-0 before:top-0 before:aspect-video hover:text-accent"
        >
          {value.title}{" "}
          <span className="text-sm font-normal leading-none text-muted">
            {value.year}
          </span>
        </a>
        <Grade value={value.grade} height={18} className="mb-4" />
        <RenderedMarkdown
          text={value.excerpt}
          className="mb-8 text-base leading-[1.6] tracking-[0.3px] text-muted"
        />
        <div className="font-sans-narrow text-xxs uppercase leading-4 tracking-[0.8px] text-subtle">
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
