import type { CollectionEntry } from "astro:content";

import { getEntry } from "astro:content";

import { getFluidWidthPosterImageProps } from "~/assets/posters";
import { PosterListItemImageConfig } from "~/components/poster-list/PosterListItem";
import { displayDate } from "~/utils/displayDate";
import { gradeToValue } from "~/utils/grades";
import { toSortYear } from "~/utils/toSortYear";

import type { CollectionTitlesProps } from "./CollectionTitles";

export async function getCollectionTitlesProps(
  collection: CollectionEntry<"collections">["data"],
): Promise<CollectionTitlesProps> {
  const distinctGenres = new Set<string>();
  const distinctReleaseYears = new Set<string>();
  const distinctReviewYears = new Set<string>();

  collection.titles.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));

  const values = await Promise.all(
    collection.titles.map(async (title, index) => {
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
        genres: title.genres,
        grade: reviewedTitle ? reviewedTitle.data.grade : undefined,
        gradeValue: reviewedTitle
          ? gradeToValue(reviewedTitle.data.grade)
          : undefined,
        imdbId: title.imdbId,
        posterImageProps: await getFluidWidthPosterImageProps(
          title.reviewSlug,
          PosterListItemImageConfig,
        ),
        releaseSequence: index,
        releaseYear: title.releaseYear,
        reviewDisplayDate: reviewedTitle
          ? displayDate(reviewedTitle.data.reviewDate, {
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
      };
    }),
  );

  return {
    distinctGenres: [...distinctGenres].toSorted(),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    initialSort: "release-date-asc",
    values,
  };
}
