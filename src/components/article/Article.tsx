import type { BackdropImageProps } from "~/api/backdrops";
import type { ReviewCardValue } from "~/components/review-card/ReviewCard";

import { Backdrop } from "~/components/backdrop/Backdrop";
import { Layout } from "~/components/layout/Layout";
import { LongFormText } from "~/components/long-form-text/LongFormText";
import { MoreReviews } from "~/components/more-reviews/MoreReviews";
import { MoreReviewsHeading } from "~/components/more-reviews/MoreReviewsHeading";

export type Props = {
  backdropImageProps: BackdropImageProps;
  content: string | undefined;
  deck: string;
  recentReviews: ReviewCardValue[];
  title: string;
};

export function Article({
  backdropImageProps,
  content,
  deck,
  recentReviews,
  title,
}: Props): React.JSX.Element {
  return (
    <Layout>
      <article>
        <Backdrop
          centerText={true}
          deck={deck}
          imageProps={backdropImageProps}
          size="large"
          title={title}
        />
        <section className="flex flex-col items-center pt-16 pb-32">
          <div className="px-container">
            <LongFormText className="max-w-prose" text={content} />
          </div>
        </section>
      </article>
      <div className="bg-subtle pt-6 pb-16">
        <MoreReviews values={recentReviews}>
          <MoreReviewsHeading
            accentText="Reviews"
            href="/reviews/"
            text="Recent "
          />
        </MoreReviews>
      </div>
    </Layout>
  );
}
