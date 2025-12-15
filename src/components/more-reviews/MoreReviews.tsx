import type { ReviewCardValue } from "~/components/review-card/ReviewCard";

import { Grade } from "~/components/grade/Grade";
import { RenderedMarkdown } from "~/components/rendered-markdown/RenderedMarkdown";
import { CardContent } from "~/components/review-card/CardContent";
import { CardFooter } from "~/components/review-card/CardFooter";
import { CardStill } from "~/components/review-card/CardStill";
import { CardTitle } from "~/components/review-card/CardTitle";
import { ReviewCard } from "~/components/review-card/ReviewCardContainer";

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
  values: ReviewCardValue[];
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
            [--review-card-still-opacity:20%]
            tablet:flex-row tablet:flex-wrap tablet:justify-between
            tablet:[--review-card-width:47%]
            laptop:flex-nowrap laptop:[--review-card-width:47%]
          `}
        >
          {values.map((value) => {
            return (
              <ReviewCard as="li" key={value.imdbId}>
                <CardStill
                  imageConfig={MoreReviewsImageConfig}
                  imageProps={value.stillImageProps}
                />
                <CardContent
                  paddingClassNames={`px-6 pb-6 laptop:pr-[14%] laptop:pl-[12%]`}
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
                </CardContent>
              </ReviewCard>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
