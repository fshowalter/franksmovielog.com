import { collectionDetails } from "~/api/collections";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { PosterListItemImageConfig } from "~/components/poster-list/PosterListItem";
import { displayDate } from "~/utils/displayDate";

import type { CollectionTitlesProps } from "./CollectionTitles";

export async function getCollectionTitlesProps(
  slug: string,
): Promise<CollectionTitlesProps> {
  const {
    collection,
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
  } = await collectionDetails(slug);

  return {
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "release-date-asc",
    values: await Promise.all(
      collection.titles
        .sort((a, b) => b.releaseSequence - a.releaseSequence)
        .map(async (title) => {
          return {
            ...title,
            posterImageProps: await getFluidWidthPosterImageProps(
              title.slug,
              PosterListItemImageConfig,
            ),
            reviewDisplayDate: displayDate(title.reviewDate),
            reviewSequence: title.reviewSequence,
            reviewYear: title.reviewDate
              ? new Date(title.reviewDate).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                  year: "numeric",
                })
              : "",
          };
        }),
    ),
  };
}
