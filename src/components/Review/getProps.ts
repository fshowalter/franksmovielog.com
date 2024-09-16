import { getAvatarImageProps } from "src/api/avatars";
import { getFluidWidthPosterImageProps } from "src/api/posters";
import { allReviews, loadContent, loadExcerptHtml } from "src/api/reviews";
import { getOpenGraphStillSrc, getStillImageProps } from "src/api/stills";

import { MoreReviewsImageConfig } from "../MoreReviews";
import { ChipAvatarImageConfig } from "./Chip";
import { PosterImageConfig } from "./Credits";
import { type Props, StillImageConfig } from "./Review";

export async function getProps(slug: string): Promise<Props> {
  const { reviews } = await allReviews();

  const review = reviews.find((review) => {
    return review.slug === slug;
  })!;

  return {
    value: await loadContent(review),
    seoImageSrc: await getOpenGraphStillSrc(slug),
    stillImageProps: await getStillImageProps(slug, StillImageConfig),
    posterImageProps: await getFluidWidthPosterImageProps(
      slug,
      PosterImageConfig,
    ),
    castAndCrewChips: await Promise.all(
      review.castAndCrew.map(async (value) => {
        return {
          ...value,
          avatarImageProps: await getAvatarImageProps(
            value.slug,
            ChipAvatarImageConfig,
          ),
        };
      }),
    ),
    collectionChips: await Promise.all(
      review.collections.map(async (value) => {
        return {
          ...value,
          avatarImageProps: await getAvatarImageProps(
            value.slug,
            ChipAvatarImageConfig,
          ),
        };
      }),
    ),
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
  };
}
