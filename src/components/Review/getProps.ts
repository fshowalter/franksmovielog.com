import { getAvatarImageProps } from "src/api/avatars";
import { getFluidWidthPosterImageProps } from "src/api/posters";
import { allReviews, loadContent } from "src/api/reviews";
import { getOpenGraphStillSrc, getStillImageProps } from "src/api/stills";
import { StillListItemImageConfig } from "src/components/StillListItem";

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
              return {
                ...title,
                stillImageProps: await getStillImageProps(
                  title.slug,
                  StillListItemImageConfig,
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
              return {
                ...title,
                stillImageProps: await getStillImageProps(
                  title.slug,
                  StillListItemImageConfig,
                ),
              };
            }),
          ),
        };
      }),
    ),
    moreReviews: await Promise.all(
      review.moreReviews.map(async (value) => {
        return {
          ...value,
          stillImageProps: await getStillImageProps(
            value.slug,
            StillListItemImageConfig,
          ),
        };
      }),
    ),
  };
}
