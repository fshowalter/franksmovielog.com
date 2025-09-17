import type { BackdropImageProps } from "~/api/backdrops";

import { getBackdropImageProps } from "~/api/backdrops";
import { collectionDetails } from "~/api/collections";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { BackdropImageConfig } from "~/components/backdrop/Backdrop";
import { PosterListItemImageConfig } from "~/components/poster-list/PosterListItem";
import { displayDate } from "~/utils/displayDate";

import type { CollectionTitlesProps } from "./CollectionTitles";

type PageProps = CollectionTitlesProps & {
  backdropImageProps: BackdropImageProps;
  description: string;
  descriptionHtml: string;
  name: string;
};

export async function getProps(slug: string): Promise<PageProps> {
  const {
    collection,
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
  } = await collectionDetails(slug);

  return {
    backdropImageProps: await getBackdropImageProps(
      collection.slug,
      BackdropImageConfig,
    ),
    description: collection.description,
    descriptionHtml: collection.descriptionHtml,
    distinctGenres,
    distinctReleaseYears,
    distinctReviewYears,
    initialSort: "release-date-asc",
    name: collection.name,
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
