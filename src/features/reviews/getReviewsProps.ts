import type { CollectionEntry } from "astro:content";

import type { ReviewsValue } from "~/features/reviews/ReviewsListItem";

import { allOverratedDisappointments } from "~/api/overrated-disappointments";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { allUnderratedSurprises } from "~/api/underrated-surprises";
import { allUnderseenGems } from "~/api/underseen-gems";
import { PosterListItemImageConfig } from "~/components/poster-list/PosterListItem";
import { displayDate } from "~/utils/displayDate";
import { gradeToValue } from "~/utils/grades";
import { toSortYear } from "~/utils/toSortYear";

import type { AllReviewsProps } from "./AllReviews";
import type { OverratedProps } from "./Overrated";
import type { UnderratedProps } from "./Underrated";
import type { UnderseenProps } from "./Underseen";

/**
 * Fetches data for the all reviews page including poster images and metadata.
 * @returns Props for the AllReviews component with all reviewed titles
 */
export async function getAllReviewsProps(
  reviews: CollectionEntry<"reviewedTitles">["data"][],
): Promise<AllReviewsProps> {
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

/**
 * Fetches data for the overrated disappointments page.
 * @returns Props for the Overrated component with overrated titles
 */
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

/**
 * Fetches data for the underrated surprises page.
 * @returns Props for the Underrated component with underrated titles
 */
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

/**
 * Fetches data for the underseen gems page.
 * @returns Props for the Underseen component with underseen titles
 */
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
        posterImageProps: await getFluidWidthPosterImageProps(
          title.review.id,
          PosterListItemImageConfig,
        ),
        releaseSequence: index,
        releaseYear: title.releaseYear,
        reviewDisplayDate: displayDate(title.reviewDate),
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
