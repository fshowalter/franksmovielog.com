import type { StillImageProps } from "src/api/stills";

import { Grade } from "./Grade";
import { RenderedMarkdown } from "./RenderedMarkdown";
import { Still } from "./Still";

export const MoreReviewsImageConfig = {
  width: 435,
  height: 179,
  sizes:
    "(min-width: 706px) 312px, (min-width: 1280) 25vw, (min-width: 1472px) 312px, 50vw",
  quality: 80,
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
        <ul className="flex w-full flex-col gap-x-[2.60416667%] gap-y-6 tablet:flex-row tablet:flex-wrap tablet:justify-between desktop:flex-nowrap">
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
    <li className="w-full tablet:w-[47%]">
      <a href={`/reviews/${value.slug}/`} className="block">
        <Still
          title={value.title}
          year={value.year}
          imageProps={value.stillImageProps}
          width={MoreReviewsImageConfig.width}
          height={MoreReviewsImageConfig.height}
          className="h-auto w-full"
          loading="lazy"
          decoding="async"
          sizes={MoreReviewsImageConfig.sizes}
        />
      </a>
      <div className="flex flex-col bg-default px-6 pb-4 pt-6 desktop:pl-[12%] desktop:pr-[14%]">
        <a
          href={`/reviews/${value.slug}/`}
          className="mb-4 block text-xl font-medium text-default"
        >
          {value.title}{" "}
          <span className="text-sm font-normal leading-none text-muted">
            {value.year}
          </span>
        </a>
        <Grade value={value.grade} height={18} className="mb-4" />
        <RenderedMarkdown
          text={value.excerpt}
          className="mb-8 text-base leading-[1.6] tracking-0.3px text-muted"
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
