import type { CollectionEntry } from "astro:content";

import { getEntry } from "astro:content";

import {
  getFluidWidthPosterImageProps,
  PosterImageConfig,
} from "~/assets/posters";
import { gradeToValue } from "~/utils/grades";
import { toDisplayDate } from "~/utils/toDisplayDate";
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

      const { src, srcSet } = await getFluidWidthPosterImageProps(
        title.reviewSlug,
      );
      return {
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
      };
    }),
  );

  return {
    distinctGenres: [...distinctGenres].toSorted(),
    distinctReleaseYears: [...distinctReleaseYears].toSorted(),
    distinctReviewYears: [...distinctReviewYears].toSorted(),
    initialSort: "release-date-asc",
    posterHeight: PosterImageConfig.height,
    posterWidth: PosterImageConfig.width,
    values,
  };
}
