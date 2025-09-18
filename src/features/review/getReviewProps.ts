import { getFixedWidthPosterImageProps } from "~/api/posters";
import { loadContent, loadExcerptHtml, type Review } from "~/api/reviews";
import { getOpenGraphStillSrc, getStillImageProps } from "~/api/stills";
import { MoreReviewsImageConfig } from "~/components/more-reviews/MoreReviews";

import type { ReviewProps } from "./Review";

import { PosterImageConfig } from "./Credits";
import { StillImageConfig } from "./Review";

export async function getReviewProps(review: Review): Promise<ReviewProps> {
  return {
    moreFromCastAndCrew: await Promise.all(
      review.moreCastAndCrew.map(async (value) => {
        return {
          ...value,
          titles: await Promise.all(
            value.titles.map(async (title) => {
              const titleWithExcerpt = await loadExcerptHtml(title);
              return {
                ...titleWithExcerpt,
                stillImageProps: await getStillImageProps(
                  titleWithExcerpt.slug,
                  MoreReviewsImageConfig,
                ),
              };
            }),
          ),
        };
      }),
    ),
    moreInCollections: await Promise.all(
      review.moreCollections.map(async (value) => {
        return {
          ...value,
          titles: await Promise.all(
            value.titles.map(async (title) => {
              const titleWithExcerpt = await loadExcerptHtml(title);
              return {
                ...titleWithExcerpt,
                stillImageProps: await getStillImageProps(
                  titleWithExcerpt.slug,
                  MoreReviewsImageConfig,
                ),
              };
            }),
          ),
        };
      }),
    ),
    moreReviews: await Promise.all(
      review.moreReviews.map(async (value) => {
        const titleWithExcerpt = await loadExcerptHtml(value);
        return {
          ...titleWithExcerpt,
          stillImageProps: await getStillImageProps(
            titleWithExcerpt.slug,
            MoreReviewsImageConfig,
          ),
        };
      }),
    ),
    posterImageProps: await getFixedWidthPosterImageProps(
      review.slug,
      PosterImageConfig,
    ),
    seoImageSrc: await getOpenGraphStillSrc(review.slug),
    stillImageProps: await getStillImageProps(review.slug, StillImageConfig),
    value: await loadContent(review),
  };
}
