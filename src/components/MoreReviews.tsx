import type { StillImageProps } from "~/api/stills";

import { ReviewCard, type ReviewCardValue } from "./ReviewCard";
import { SubHeading } from "./SubHeading";

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
  values: ReviewCardValue[];
}): React.JSX.Element {
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
            flex w-full flex-col items-start gap-[3%] gap-y-[6vw]
            tablet:flex-row tablet:flex-wrap tablet:justify-between
            tablet:[--review-card-width:47%]
            laptop:flex-nowrap laptop:[--review-card-width:47%]
          `}
        >
          {values.map((value) => {
            return (
              <ReviewCard
                as="li"
                imageConfig={MoreReviewsImageConfig}
                key={value.slug}
                value={value}
                variant="secondary"
              />
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export function MoreReviewsHeading({
  accentText,
  as = "h2",
  href,
  text,
}: {
  accentText: string;
  as?: "h2" | "h3" | "h4" | "h5";
  href: string;
  text: string;
}): React.JSX.Element {
  return (
    <SubHeading as={as}>
      <a
        className={`
          relative -mb-1 inline-block transform-gpu pb-1 transition-all
          after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
          after:origin-bottom-right after:scale-x-0 after:bg-accent
          after:transition-transform after:duration-500
          hover:after:scale-x-100
        `}
        href={href}
      >
        {text} <span className={`text-accent`}>{accentText}</span>
      </a>
    </SubHeading>
  );
}
