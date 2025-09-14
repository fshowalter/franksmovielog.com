import type { BackdropImageProps } from "~/api/backdrops";
import type { ReviewCardValue } from "~/components/ReviewCard";

import { Backdrop } from "~/components/Backdrop";
import { Layout } from "~/components/Layout/Layout";
import { LongFormText } from "~/components/LongFormText";
import { MoreReviews, MoreReviewsHeading } from "~/components/MoreReviews";

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
