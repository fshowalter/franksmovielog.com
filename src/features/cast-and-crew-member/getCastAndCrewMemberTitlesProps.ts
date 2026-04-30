import type { CollectionEntry } from "astro:content";

import { getEntry } from "astro:content";

import {
  getFluidWidthPosterImageProps,
  PosterImageConfig,
} from "~/assets/posters";
import { gradeToValue } from "~/utils/grades";
import { toDisplayDate } from "~/utils/toDisplayDate";
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
      let reviewedTitle;

      if (title.reviewSlug) {
        reviewedTitle = await getEntry("reviewedTitles", title.reviewSlug);
      }

      if (title.reviewSlug && !reviewedTitle) {
        throw new Error(
          `Reviewed title not found for slug: ${title.reviewSlug}`,
        );
      }

      if (reviewedTitle) {
        distinctReviewYears.add(toSortYear(reviewedTitle.data.reviewDate));
      }

      for (const genre of title.genres) {
        distinctGenres.add(genre);
      }
      distinctReleaseYears.add(title.releaseYear);

      const { src, srcSet } = await getFluidWidthPosterImageProps(
        reviewedTitle ? title.reviewSlug : "default",
      );

      return {
        creditedAs: title.creditedAs,
        genres: title.genres,
        imdbId: title.imdbId,
        posterSrcProps: { src, srcSet },
        releaseSequence: index,
        releaseYear: title.releaseYear,
        sortTitle: title.sortTitle,
        title: title.title,

        ...(reviewedTitle && {
          grade: reviewedTitle.data.grade,
          gradeValue: gradeToValue(reviewedTitle.data.grade),
          reviewDisplayDate: toDisplayDate(reviewedTitle.data.reviewDate, {
            dayFormat: "numeric",
          }),
          reviewSequence: reviewedTitle.data.reviewSequence,
          reviewSlug: title.reviewSlug,
          reviewYear: toSortYear(reviewedTitle.data.reviewDate),
        }),

        ...(title.watchlistCollectionNames.length > 0 && {
          watchlistCollectionNames: title.watchlistCollectionNames,
        }),
        ...(title.watchlistDirectorNames.length > 0 && {
          watchlistDirectorNames: title.watchlistDirectorNames,
        }),
        ...(title.watchlistPerformerNames.length > 0 && {
          watchlistPerformerNames: title.watchlistPerformerNames,
        }),
        ...(title.watchlistWriterNames.length > 0 && {
          watchlistWriterNames: title.watchlistWriterNames,
        }),
      };
    }),
  );

  return {
    distinctCreditKinds: member.creditedAs,
    distinctGenres: [...distinctGenres].toSorted(),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    initialSort: "release-date-asc",
    posterHeight: PosterImageConfig.height,
    posterWidth: PosterImageConfig.width,
    values,
  };
}
