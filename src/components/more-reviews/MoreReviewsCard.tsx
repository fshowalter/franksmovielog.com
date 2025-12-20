import type { StillImageProps } from "~/api/stills";

import { CardElevatingContainer } from "~/components/card-elevating-container/CardElevatingContainer";
import { CardFooter } from "~/components/card-footer/CardFooter";
import { CardStill } from "~/components/card-still/CardStill";
import { CardTitle } from "~/components/card-title/CardTitle";
import { Grade } from "~/components/grade/Grade";
import { RenderedMarkdown } from "~/components/rendered-markdown/RenderedMarkdown";

import { MoreReviewsImageConfig } from "./MoreReviews";

export type MoreReviewsCardValue = {
  excerpt: string;
  genres: readonly string[];
  grade: string;
  releaseYear: string;
  slug: string;
  stillImageProps: StillImageProps;
  title: string;
};

export function MoreReviewsCard({
  value,
}: {
  value: MoreReviewsCardValue;
}): React.JSX.Element {
  return (
    <CardElevatingContainer as="li" mobilePadding={false}>
      <CardStill
        imageConfig={MoreReviewsImageConfig}
        imageProps={value.stillImageProps}
      />
      <div
        className={`
          flex grow flex-col px-6 pb-6
          laptop:pr-[14%] laptop:pl-[12%]
        `}
      >
        <CardTitle
          leadingClassNames="leading-6"
          releaseYear={value.releaseYear}
          slug={value.slug}
          textSizeClassNames="text-xl"
          title={value.title}
        />
        <Grade className="mb-4" height={18} value={value.grade} />
        <RenderedMarkdown
          className={`mb-8 leading-[1.6] tracking-prose text-muted`}
          text={value.excerpt}
        />
        <CardFooter>{value.genres.join(", ")}</CardFooter>
      </div>
    </CardElevatingContainer>
  );
}
