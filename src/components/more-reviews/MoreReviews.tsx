import type { ReviewCardValue } from "~/components/review-card/ReviewCard";

import { ReviewCard } from "~/components/review-card/ReviewCard";

export const MoreReviewsImageConfig = {
  height: 360,
  sizes:
    "(max-width: 767px) 84vw, (max-width: 1279px) calc((100vw - 96px) * 0.47), (max-width: 1695px) calc((100vw - 160px) * .22735), 350px",
  width: 640,
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
