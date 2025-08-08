import type { ReviewListItemValue } from "~/components/ReviewListItem";

import { getBackdropImageProps } from "~/api/backdrops";
import { allOverratedDisappointments } from "~/api/overratedDisappointments";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { allReviews } from "~/api/reviews";
import { allUnderratedSurprises } from "~/api/underratedSurprises";
import { allUnderseenGems } from "~/api/underseenGems";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemPosterImageConfig } from "~/components/ListItemPoster";

import type { Props } from "./AllReviews";
import type { Props as OverratedProps } from "./Overrated";
import type { Props as UnderratedProps } from "./Underrated";
import type { Props as UnderseenProps } from "./Underseen";

export async function getProps(): Promise<Props & { metaDescription: string }> {
  const { distinctGenres, distinctReleaseYears, distinctReviewYears, reviews } =
    await allReviews();

  const values = await buildReviewListItemValues(reviews, true);

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

export async function getPropsForOverrated(): Promise<
  OverratedProps & { metaDescription: string }
> {
  const {
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    overratedDisappointments,
  } = await allOverratedDisappointments();

  const values = await buildReviewListItemValues(
    overratedDisappointments,
    false,
  );

  return {
    backdropImageProps: await getBackdropImageProps(
      "overrated",
      BackdropImageConfig,
    ),
    deck: "One and two star movies with an above-average IMDb rating.",
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "release-date-desc",
    metaDescription:
      "Feeling contrarian? Behold my one and two star reviews of movies that somehow received and above-average IMDb rating.",
    values,
  };
}

export async function getPropsForUnderrated(): Promise<
  UnderratedProps & { metaDescription: string }
> {
  const {
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    underratedSurprises,
  } = await allUnderratedSurprises();

  const values = await buildReviewListItemValues(underratedSurprises, false);

  return {
    backdropImageProps: await getBackdropImageProps(
      "underrated",
      BackdropImageConfig,
    ),
    deck: "Four and five star movies with a below-average IMDb rating.",
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "release-date-desc",
    metaDescription:
      "The masses are wrong. These are movies have a four or five star review despite a below-average IMDb rating.",
    values,
  };
}

export async function getPropsForUnderseen(): Promise<
  UnderseenProps & { metaDescription: string }
> {
  const {
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    underseenGems,
  } = await allUnderseenGems();

  const values = await buildReviewListItemValues(underseenGems, false);

  return {
    backdropImageProps: await getBackdropImageProps(
      "underseen",
      BackdropImageConfig,
    ),
    deck: "Four and five star movies with a below average number of IMDb votes.",
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "release-date-desc",
    metaDescription:
      "Looking for something new? Behold my four and five star reviews of movies with a below average number of IMDb votes.",
    values,
  };
}

async function buildReviewListItemValues(
  reviews: {
    date?: Date;
    genres: string[];
    grade: string;
    gradeValue: number;
    imdbId: string;
    releaseSequence: string;
    releaseYear: string;
    reviewDate?: Date | string;
    reviewSequence?: string;
    sequence?: string;
    slug: string;
    sortTitle: string;
    title: string;
  }[],
  includeReviewMonth: boolean,
): Promise<ReviewListItemValue[]> {
  return Promise.all(
    reviews.map(async (review) => {
      const dateValue = review.date || review.reviewDate!;
      const date =
        typeof dateValue === "string"
          ? new Date(`${dateValue}T00:00:00.000Z`)
          : dateValue;
      const sequence = review.sequence || review.reviewSequence!;

      const value: ReviewListItemValue = {
        genres: review.genres,
        grade: review.grade,
        gradeValue: review.gradeValue,
        imdbId: review.imdbId,
        posterImageProps: await getFluidWidthPosterImageProps(
          review.slug,
          ListItemPosterImageConfig,
        ),
        releaseSequence: review.releaseSequence,
        releaseYear: review.releaseYear,
        reviewDisplayDate: `${date.toLocaleDateString("en-US", {
          timeZone: "UTC",
          year: "numeric",
        })}-${date.toLocaleDateString("en-US", {
          month: "short",
          timeZone: "UTC",
        })}-${date.toLocaleDateString("en-US", {
          day: "2-digit",
          timeZone: "UTC",
        })}`,
        ...(includeReviewMonth && {
          reviewMonth: date.toLocaleDateString("en-US", {
            month: "long",
            timeZone: "UTC",
          }),
        }),
        reviewSequence: sequence,
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
