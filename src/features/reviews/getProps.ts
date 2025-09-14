import type { BackdropImageProps } from "~/api/backdrops";
import type { ReviewsValue } from "~/features/reviews/ReviewsListItem";

import { getBackdropImageProps } from "~/api/backdrops";
import { allOverratedDisappointments } from "~/api/overrated-disappointments";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { allReviews } from "~/api/reviews";
import { allUnderratedSurprises } from "~/api/underrated-surprises";
import { allUnderseenGems } from "~/api/underseen-gems";
import { BackdropImageConfig } from "~/components/backdrop/Backdrop";
import { PosterListItemImageConfig } from "~/components/poster-list/PosterListItem";
import { displayDate } from "~/utils/displayDate";

import type { AllReviewsProps } from "./AllReviews";
import type { OverratedProps } from "./Overrated";
import type { UnderratedProps } from "./Underrated";
import type { UnderseenProps } from "./Underseen";

type PageProps<T> = T & {
  backdropImageProps: BackdropImageProps;
  deck: string;
  metaDescription: string;
};

export async function getAllReviewsProps(): Promise<
  PageProps<AllReviewsProps>
> {
  const { distinctGenres, distinctReleaseYears, distinctReviewYears, reviews } =
    await allReviews();

  const values = await buildReviewValues(reviews, true);

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
    metaDescription:
      "All my movie reviews, from 2003 to present day. Filter by title, genre, review date, release date, or grade. Sort by best or worst, oldest or newest, or title.",
    values,
  };
}

export async function getOverratedProps(): Promise<PageProps<OverratedProps>> {
  const {
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    overratedDisappointments,
  } = await allOverratedDisappointments();

  const values = await buildReviewValues(overratedDisappointments, false);

  return {
    backdropImageProps: await getBackdropImageProps(
      "overrated",
      BackdropImageConfig,
    ),
    deck: "One and two star movies with an above-average IMDb rating.",
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "title-asc",
    metaDescription:
      "Feeling contrarian? Behold my one and two star reviews of movies that somehow received and above-average IMDb rating.",
    values,
  };
}

export async function getUnderratedProps(): Promise<
  PageProps<UnderratedProps>
> {
  const {
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    underratedSurprises,
  } = await allUnderratedSurprises();

  const values = await buildReviewValues(underratedSurprises, false);

  return {
    backdropImageProps: await getBackdropImageProps(
      "underrated",
      BackdropImageConfig,
    ),
    deck: "Four and five star movies with a below-average IMDb rating.",
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "title-asc",
    metaDescription:
      "The masses are wrong. These are movies have a four or five star review despite a below-average IMDb rating.",
    values,
  };
}

export async function getUnderseenProps(): Promise<PageProps<UnderseenProps>> {
  const {
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    underseenGems,
  } = await allUnderseenGems();

  const values = await buildReviewValues(underseenGems, false);

  return {
    backdropImageProps: await getBackdropImageProps(
      "underseen",
      BackdropImageConfig,
    ),
    deck: "Four and five star movies with a below average number of IMDb votes.",
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "title-asc",
    metaDescription:
      "Looking for something new? Behold my four and five star reviews of movies with a below average number of IMDb votes.",
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
