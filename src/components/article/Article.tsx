import type { ReviewCardValue } from "~/components/review-card/ReviewCard";
import { LongFormText } from "~/components/long-form-text/LongFormText";
import { MoreReviews } from "~/components/more-reviews/MoreReviews";
import { MoreReviewsHeading } from "~/components/more-reviews/MoreReviewsHeading";

export type ArticleProps = {
  content: string | undefined;
  recentReviews: ReviewCardValue[];
};

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
