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
    <Layout>
      <article>
        <Backdrop
          deck={deck}
          imageProps={backdropImageProps}
          size="large"
          title={title}
        />
        <section className="flex flex-col items-center pb-32 pt-16">
          <div className="px-container">
            <LongFormText className="max-w-prose" text={content} />
          </div>
        </section>
      </article>
      <div className="bg-subtle pb-16 pt-6">
        <MoreReviews values={recentReviews}>
          <SubHeading as="h2">
            Recent{" "}
            <a className="text-accent" href="/reviews/">
              Reviews
            </a>
          </SubHeading>
        </MoreReviews>
      </div>
    </Layout>
  );
}
