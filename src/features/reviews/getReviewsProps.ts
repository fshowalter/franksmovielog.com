import type { ReviewsValue } from "~/features/reviews/ReviewsListItem";

import { allOverratedDisappointments } from "~/api/overrated-disappointments";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { allReviews } from "~/api/reviews";
import { allUnderratedSurprises } from "~/api/underrated-surprises";
import { allUnderseenGems } from "~/api/underseen-gems";
import { PosterListItemImageConfig } from "~/components/poster-list/PosterListItem";
import { displayDate } from "~/utils/displayDate";

import type { AllReviewsProps } from "./AllReviews";
import type { OverratedProps } from "./Overrated";
import type { UnderratedProps } from "./Underrated";
import type { UnderseenProps } from "./Underseen";

export async function getAllReviewsProps(): Promise<AllReviewsProps> {
  const { distinctGenres, distinctReleaseYears, distinctReviewYears, reviews } =
    await allReviews();

  const values = await buildReviewValues(reviews, true);

  return {
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "title-asc",
    values,
  };
}

export async function getOverratedProps(): Promise<OverratedProps> {
  const {
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    overratedDisappointments,
  } = await allOverratedDisappointments();

  const values = await buildReviewValues(overratedDisappointments, false);

  return {
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "title-asc",
    values,
  };
}

export async function getUnderratedProps(): Promise<UnderratedProps> {
  const {
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    underratedSurprises,
  } = await allUnderratedSurprises();

  const values = await buildReviewValues(underratedSurprises, false);

  return {
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "title-asc",
    values,
  };
}

export async function getUnderseenProps(): Promise<UnderseenProps> {
  const {
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    underseenGems,
  } = await allUnderseenGems();

  const values = await buildReviewValues(underseenGems, false);

  return {
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "title-asc",
    values,
  };
}

async function buildReviewValues(
  reviews: {
    genres: string[];
    grade: string;
    gradeValue: number;
    imdbId: string;
    releaseSequence: number;
    releaseYear: string;
    reviewDate: Date;
    reviewSequence: number;
    slug: string;
    sortTitle: string;
    title: string;
  }[],
  includeReviewMonth: boolean,
): Promise<ReviewsValue[]> {
  return Promise.all(
    reviews.map(async (review) => {
      const date = review.reviewDate;

      const value: ReviewsValue = {
        genres: review.genres,
        grade: review.grade,
        gradeValue: review.gradeValue,
        imdbId: review.imdbId,
        posterImageProps: await getFluidWidthPosterImageProps(
          review.slug,
          PosterListItemImageConfig,
        ),
        releaseSequence: review.releaseSequence,
        releaseYear: review.releaseYear,
        reviewDisplayDate: displayDate(review.reviewDate),
        ...(includeReviewMonth && {
          reviewMonth: date.toLocaleDateString("en-US", {
            month: "long",
            timeZone: "UTC",
          }),
        }),
        reviewSequence: review.reviewSequence,
        reviewYear: date.toLocaleDateString("en-US", {
          timeZone: "UTC",
          year: "numeric",
        }),
        slug: review.slug,
        sortTitle: review.sortTitle,
        title: review.title,
      };

      return value;
    }),
  );
}
