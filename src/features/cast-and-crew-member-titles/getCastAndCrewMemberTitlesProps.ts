import type { CollectionEntry } from "astro:content";

import { getEntry } from "astro:content";

import { getFluidWidthPosterImageProps } from "~/assets/posters";
import { PosterListItemImageConfig } from "~/components/poster-list/PosterListItem";
import { displayDate } from "~/utils/displayDate";
import { gradeToValue } from "~/utils/grades";
import { toSortYear } from "~/utils/toSortYear";

import type { CastAndCrewMemberTitlesProps } from "./CastAndCrewMemberTitles";

/**
 * Fetches data for a cast/crew member's titles page including their filmography with poster images.
 * @param slug - The slug identifier for the cast/crew member
 * @returns Props for the CastAndCrewMemberTitles component
 */
export async function getCastAndCrewMemberTitlesProps(
  member: CollectionEntry<"castAndCrew">["data"],
): Promise<CastAndCrewMemberTitlesProps> {
  const distinctGenres = new Set<string>();
  const distinctReleaseYears = new Set<string>();
  const distinctReviewYears = new Set<string>();

  member.titles.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));

  const values = await Promise.all(
    member.titles.map(async (title, index) => {
      let review;
      let reviewedTitle;

      if (title.reviewSlug) {
        review = await getEntry("reviews", title.reviewSlug);
      }

      if (title.reviewSlug && !review) {
        throw new Error(`Review not found for slug: ${title.reviewSlug}`);
      }

      if (review) {
        distinctReviewYears.add(toSortYear(review.data.date));
        reviewedTitle = await getEntry(review.data.title);
      }

      for (const genre of title.genres) {
        distinctGenres.add(genre);
      }
      distinctReleaseYears.add(title.releaseYear);

      return {
        creditedAs: title.creditedAs,
        excerpt: review ? review.data.excerptHtml : undefined,
        genres: title.genres,
        grade: review ? review.data.grade : undefined,
        gradeValue: review ? gradeToValue(review.data.grade) : undefined,
        imdbId: title.imdbId,
        posterImageProps: await getFluidWidthPosterImageProps(
          review ? review.data.slug : "default",
          PosterListItemImageConfig,
        ),
        releaseSequence: index,
        releaseYear: title.releaseYear,
        reviewDisplayDate: review
          ? displayDate(review.data.date, {
              dayFormat: "numeric",
            })
          : undefined,
        reviewSequence: reviewedTitle
          ? reviewedTitle.data.reviewSequence
          : undefined,
        reviewYear: review ? toSortYear(review.data.date) : undefined,
        slug: review ? review.data.slug : undefined,
        sortTitle: title.sortTitle,
        title: title.title,
        watchlistCollectionNames: title.watchlistCollectionNames,
        watchlistDirectorNames: title.watchlistDirectorNames,
        watchlistPerformerNames: title.watchlistPerformerNames,
        watchlistWriterNames: title.watchlistWriterNames,
      };
    }),
  );

  return {
    distinctCreditKinds: member.creditedAs,
    distinctGenres: [...distinctGenres].toSorted(),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    initialSort: "release-date-asc",
    values,
  };
}
