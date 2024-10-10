import type { BackdropImageProps } from "src/api/backdrops";
import type { MoreReviewsValue } from "src/components/MoreReviews";

import { Backdrop } from "src/components/Backdrop";
import { Layout } from "src/components/Layout";
import { LongFormText } from "src/components/LongFormText";
import { MoreReviews } from "src/components/MoreReviews";
import { SubHeading } from "src/components/SubHeading";

export interface Props {
  backdropImageProps: BackdropImageProps;
  content: null | string;
  deck: string;
  recentReviews: MoreReviewsValue[];
  title: string;
}

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
