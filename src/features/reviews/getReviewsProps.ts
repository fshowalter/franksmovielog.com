import type { CollectionEntry } from "astro:content";

import { getFluidWidthPosterImageProps } from "~/assets/posters";
import { gradeToValue } from "~/utils/grades";
import { toDisplayDate } from "~/utils/toDisplayDate";
import { toSortYear } from "~/utils/toSortYear";

import type { ReviewsProps, ReviewsValue } from "./Reviews";

/**
 * Fetches data for the all reviews page including poster images and metadata.
 * @returns Props for the AllReviews component with all reviewed titles
 */
export async function getReviewsProps(
  reviews: CollectionEntry<"reviewedTitles">["data"][],
): Promise<ReviewsProps> {
  const { distinctGenres, distinctReleaseYears, distinctReviewYears, values } =
    await buildReviewValues(reviews);

  return {
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "title-asc",
    values,
  };
}

async function buildReviewValues(
  titles: CollectionEntry<"reviewedTitles">["data"][],
): Promise<{
  distinctGenres: string[];
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
  values: ReviewsValue[];
}> {
  const distinctReviewYears = new Set<string>();
  const distinctReleaseYears = new Set<string>();
  const distinctGenres = new Set<string>();

  titles.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));

  const values = await Promise.all(
    titles.map(async (title, index) => {
      for (const genre of title.genres) {
        distinctGenres.add(genre);
      }
      distinctReleaseYears.add(title.releaseYear);
      distinctReviewYears.add(toSortYear(title.reviewDate));

      const value: ReviewsValue = {
        genres: title.genres,
        grade: title.grade,
        gradeValue: gradeToValue(title.grade),
        imdbId: title.imdbId,
        posterImageProps: await getFluidWidthPosterImageProps(title.review.id),
        releaseSequence: index,
        releaseYear: title.releaseYear,
        reviewDisplayDate: toDisplayDate(title.reviewDate),
        reviewSequence: title.reviewSequence,
        reviewYear: toSortYear(title.reviewDate),
        slug: title.review.id,
        sortTitle: title.sortTitle,
        title: title.title,
      };

      return value;
    }),
  );

  return {
    distinctGenres: [...distinctGenres].toSorted(),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    values,
  };
}
