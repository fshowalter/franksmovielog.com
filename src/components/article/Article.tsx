import type { ReviewCardValue } from "~/components/review-card/ReviewCard";

import { LongFormText } from "~/components/long-form-text/LongFormText";
import { MoreReviews } from "~/components/more-reviews/MoreReviews";
import { MoreReviewsHeading } from "~/components/more-reviews/MoreReviewsHeading";

/**
 * Props for the Article component.
 */
export type ArticleProps = {
  content: string | undefined;
  recentReviews: ReviewCardValue[];
};

/**
 * Article page component with content and recent reviews.
 * @param props - Component props
 * @param props.content - Markdown content for the article
 * @param props.recentReviews - Recent review data to display
 * @returns Article layout with content and recent reviews section
 */
export function Article({
  content,
  recentReviews,
}: ArticleProps): React.JSX.Element {
  return (
    <>
      <section className="flex flex-col items-center pt-16 pb-32">
        <div className="px-container">
          <LongFormText className="max-w-prose" text={content} />
        </div>
      </section>
      <div className="bg-subtle pt-6 pb-16">
        <MoreReviews values={recentReviews}>
          <MoreReviewsHeading
            accentText="Reviews"
            href="/reviews/"
            text="Recent "
          />
        </MoreReviews>
      </div>
    </>
  );
}
