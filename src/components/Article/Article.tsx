import type { BackdropImageProps } from "src/api/backdrops";
import { Backdrop } from "src/components/Backdrop";
import { Layout } from "src/components/Layout";
import { LongFormText } from "src/components/LongFormText";
import type { MoreReviewsValue } from "src/components/MoreReviews";
import { MoreReviews } from "src/components/MoreReviews";
import { SubHeading } from "src/components/SubHeading";

export interface Props {
  content: string | null;
  title: string;
  deck: string;
  backdropImageProps: BackdropImageProps;
  recentReviews: MoreReviewsValue[];
}

export function Article({
  title,
  content,
  recentReviews,
  deck,
  backdropImageProps,
}: Props): JSX.Element {
  return (
    <Layout>
      <article>
        <Backdrop
          imageProps={backdropImageProps}
          title={title}
          deck={deck}
          size="large"
        />
        <section className="flex flex-col items-center">
          <div className="spacer-y-16" />
          <div className="px-pageMargin">
            <LongFormText text={content} className="max-w-prose" />
          </div>
          <div className="spacer-y-32" />
        </section>
      </article>
      <section className="bg-subtle pb-16 pt-6">
        <MoreReviews values={recentReviews}>
          <SubHeading as="h2">
            Recent{" "}
            <a href="/reviews/" className="text-accent">
              Reviews
            </a>
          </SubHeading>
        </MoreReviews>
      </section>
    </Layout>
  );
}
