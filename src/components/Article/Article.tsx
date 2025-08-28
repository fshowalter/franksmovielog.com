import type { JSX } from "react";

import type { BackdropImageProps } from "~/api/backdrops";
import type { MoreReviewsValue } from "~/components/MoreReviews";

import { Backdrop } from "~/components/Backdrop";
import { Layout } from "~/components/Layout";
import { LongFormText } from "~/components/LongFormText";
import { MoreReviews } from "~/components/MoreReviews";
import { SubHeading } from "~/components/SubHeading";

export type Props = {
  backdropImageProps: BackdropImageProps;
  content: string | undefined;
  deck: string;
  recentReviews: MoreReviewsValue[];
  title: string;
};

export function Article({
  backdropImageProps,
  content,
  deck,
  recentReviews,
  title,
}: Props): JSX.Element {
  return (
    <Layout bgClasses="">
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
            <LongFormText otherClasses="max-w-prose" text={content} />
          </div>
        </section>
      </article>
      <div className="bg-subtle pt-6 pb-16">
        <MoreReviews values={recentReviews}>
          <SubHeading as="h2">
            <a
              className={`
                relative -mb-1 inline-block transform-gpu pb-1 transition-all
                after:absolute after:bottom-0 after:left-0 after:h-px
                after:w-full after:origin-bottom-right after:scale-x-0
                after:bg-accent after:transition-transform after:duration-500
                hover:after:scale-x-100
              `}
              href={`/reviews/`}
            >
              Recent <span className={`text-accent`}>Reviews</span>
            </a>
          </SubHeading>
        </MoreReviews>
      </div>
    </Layout>
  );
}
