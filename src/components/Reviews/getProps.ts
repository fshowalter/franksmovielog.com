import { getBackdropImageProps } from "src/api/backdrops";
import { getFluidWidthPosterImageProps } from "src/api/posters";
import { allReviews } from "src/api/reviews";
import { BackdropImageConfig } from "src/components/Backdrop";
import { ListItemPosterImageConfig } from "src/components/ListItemPoster";

import type { ListItemValue, Props } from "./Reviews";

export async function getProps(): Promise<Props> {
  const { distinctGenres, distinctReleaseYears, distinctReviewYears, reviews } =
    await allReviews();

  reviews.sort((a, b) => a.sortTitle.localeCompare(b.sortTitle));

  const values = await Promise.all(
    reviews.map(async (review) => {
      const value: ListItemValue = {
        genres: review.genres,
        grade: review.grade,
        gradeValue: review.gradeValue,
        imdbId: review.imdbId,
        posterImageProps: await getFluidWidthPosterImageProps(
          review.slug,
          ListItemPosterImageConfig,
        ),
        releaseSequence: review.releaseSequence,
        reviewDate: review.date.toISOString(),
        reviewMonth: review.date.toLocaleDateString("en-US", {
          month: "long",
          timeZone: "UTC",
        }),
        reviewYear: review.date.toLocaleDateString("en-US", {
          timeZone: "UTC",
          year: "numeric",
        }),
        slug: review.slug,
        sortTitle: review.sortTitle,
        title: review.title,
        year: review.year,
      };

      return value;
    }),
  );

  return {
    backdropImageProps: await getBackdropImageProps(
      "reviews",
      BackdropImageConfig,
    ),
    deck: `"'Sorry' don't get it done, Dude."`,
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "title-asc",
    values,
  };
}
