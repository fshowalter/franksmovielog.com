import { getFixedWidthPosterImageProps } from "src/api/posters";
import { allReviews } from "src/api/reviews";
import { ListItemPosterImageConfig } from "src/components/ListItemPoster";

import type { ListItemValue } from "./List";
import type { Props } from "./Reviews";

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
        posterImageProps: await getFixedWidthPosterImageProps(
          review.slug,
          ListItemPosterImageConfig,
        ),
      };

      return value;
    }),
  );

  return {
    values,
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "title-asc",
  };
}
