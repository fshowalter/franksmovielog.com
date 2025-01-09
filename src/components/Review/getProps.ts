import { ListItemPosterImageConfig } from "src/components/ListItemPoster";

import {
  getFixedWidthPosterImageProps,
  getFluidWidthPosterImageProps,
} from "~/api/posters";
import { allReviews, loadContent, loadExcerptHtml } from "~/api/reviews";
import { getOpenGraphStillSrc, getStillImageProps } from "~/api/stills";
import { MoreReviewsImageConfig } from "~/components/MoreReviews";

import { PosterImageConfig } from "./Credits";
import { type Props, StillImageConfig } from "./Review";

export async function getProps(slug: string): Promise<Props> {
  const { reviews } = await allReviews();

  const review = reviews.find((review) => {
    return review.slug === slug;
  })!;

  return {
    moreFromCastAndCrew: await Promise.all(
      review.moreCastAndCrew.map(async (value) => {
        return {
          ...value,
          titles: await Promise.all(
            value.titles.map(async (title) => {
              const titleWithExcerpt = loadExcerptHtml(title);
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
              const titleWithExcerpt = loadExcerptHtml(title);
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
        const titleWithExcerpt = loadExcerptHtml(value);
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
      slug,
      PosterImageConfig,
    ),
    searchPosterImageProps: await getFluidWidthPosterImageProps(
      review.slug,
      ListItemPosterImageConfig,
    ),
    seoImageSrc: await getOpenGraphStillSrc(slug),
    stillImageProps: await getStillImageProps(slug, StillImageConfig),
    value: await loadContent(review),
  };
}
