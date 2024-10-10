import { getBackdropImageProps } from "src/api/backdrops";
import { getFluidWidthPosterImageProps } from "src/api/posters";
import { allReviews } from "src/api/reviews";
import { ListItemPosterImageConfig } from "src/components/ListItemPoster";

import { BackdropImageConfig } from "../Backdrop";
import type { ListItemValue, Props } from "./Reviews";

export async function getProps(): Promise<Props> {
  const { reviews, distinctGenres, distinctReleaseYears, distinctReviewYears } =
    await allReviews();

  reviews.sort((a, b) => a.sortTitle.localeCompare(b.sortTitle));

  const values = await Promise.all(
    reviews.map(async (review) => {
      const value: ListItemValue = {
        reviewDate: review.date.toISOString(),
        reviewMonth: review.date.toLocaleDateString("en-US", {
          timeZone: "UTC",
          month: "long",
        }),
        reviewYear: review.date.toLocaleDateString("en-US", {
          timeZone: "UTC",
          year: "numeric",
        }),
        imdbId: review.imdbId,
        title: review.title,
        year: review.year,
        slug: review.slug,
        genres: review.genres,
        grade: review.grade,
        releaseSequence: review.releaseSequence,
        gradeValue: review.gradeValue,
        sortTitle: review.sortTitle,
        posterImageProps: await getFluidWidthPosterImageProps(
          review.slug,
          ListItemPosterImageConfig,
        ),
      };

      return value;
    }),
  );

  return {
    deck: `"'Sorry' don't get it done, Dude."`,
    values,
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "title-asc",
    backdropImageProps: await getBackdropImageProps(
      "reviews",
      BackdropImageConfig,
    ),
  };
}
