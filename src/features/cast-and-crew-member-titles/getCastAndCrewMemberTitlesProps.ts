import type { CollectionEntry } from "astro:content";

import { getEntry } from "astro:content";

import { getFluidWidthPosterImageProps } from "~/assets/posters";
import { PosterListItemImageConfig } from "~/components/poster-list/PosterListItem";
import { toDisplayDate } from "~/components/utils/toDisplayDate";
import { toSortYear } from "~/components/utils/toSortYear";
import { gradeToValue } from "~/utils/grades";

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

      return {
        creditedAs: title.creditedAs,
        genres: title.genres,
        grade: reviewedTitle ? reviewedTitle.data.grade : undefined,
        gradeValue: reviewedTitle
          ? gradeToValue(reviewedTitle.data.grade)
          : undefined,
        imdbId: title.imdbId,
        posterImageProps: await getFluidWidthPosterImageProps(
          reviewedTitle ? title.reviewSlug : "default",
          PosterListItemImageConfig,
        ),
        releaseSequence: index,
        releaseYear: title.releaseYear,
        reviewDisplayDate: reviewedTitle
          ? toDisplayDate(reviewedTitle.data.reviewDate, {
              dayFormat: "numeric",
            })
          : undefined,
        reviewSequence: reviewedTitle
          ? reviewedTitle.data.reviewSequence
          : undefined,
        reviewSlug: reviewedTitle ? title.reviewSlug : undefined,
        reviewYear: reviewedTitle
          ? toSortYear(reviewedTitle.data.reviewDate)
          : undefined,
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
