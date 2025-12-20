import type { MoreReviewsCardValue } from "./MoreReviewsCard";

import { MoreReviewsCard } from "./MoreReviewsCard";

/**
 * Data structure for a review in the more reviews section.
 * Extends MoreReviewsCardValue with an imdbId for unique identification.
 */
export type MoreReviewsValue = MoreReviewsCardValue & {
  imdbId: string;
};

/**
 * Image configuration for review cards in the more reviews section.
 */
export const MoreReviewsImageConfig = {
  height: 360,
  sizes:
    "(max-width: 767px) 84vw, (max-width: 1279px) calc((100vw - 96px) * 0.47), (max-width: 1695px) calc((100vw - 160px) * .22735), 350px",
  width: 640,
};

/**
 * Grid component displaying related review cards.
 * @param props - Component props
 * @param props.children - Heading element to display above reviews
 * @param props.values - Array of review data to display
 * @returns Navigation section with review cards grid
 */
export function MoreReviews({
  children,
  values,
}: {
  children: React.ReactNode;
  values: MoreReviewsValue[];
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
            [--still-opacity:20%]
            tablet:flex-row tablet:flex-wrap tablet:justify-between
            tablet:[--card-width:47%]
            laptop:flex-nowrap laptop:[--card-width:47%]
          `}
        >
          {values.map((value) => {
            return <MoreReviewsCard key={value.imdbId} value={value} />;
          })}
        </ul>
      </div>
    </nav>
  );
}
