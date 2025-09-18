import { getFluidWidthPosterImageProps } from "~/api/posters";
import { allViewings } from "~/api/viewings";
import { PosterListItemImageConfig } from "~/components/poster-list/PosterListItem";

import type { ViewingsProps, ViewingsValue } from "./Viewings";

import { sortViewings } from "./sortViewings";

/**
 * Fetches data for the viewings page including poster images and metadata.
 * @returns Props for the Viewings component with all viewings sorted by date
 */
export async function getViewingsProps(): Promise<ViewingsProps> {
  const {
    distinctMedia,
    distinctReleaseYears,
    distinctVenues,
    distinctViewingYears,
    viewings,
  } = await allViewings();

  const values = await Promise.all(
    viewings.map(async (viewing) => {
      const value: ViewingsValue = {
        medium: viewing.medium,
        posterImageProps: await getFluidWidthPosterImageProps(
          viewing.slug,
          PosterListItemImageConfig,
        ),
        releaseSequence: viewing.releaseSequence,
        releaseYear: viewing.releaseYear,
        slug: viewing.slug,
        sortTitle: viewing.sortTitle,
        title: viewing.title,
        venue: viewing.venue,
        viewingDate: viewing.viewingDate,
        viewingSequence: viewing.viewingSequence,
        viewingYear: viewing.viewingYear,
      };

      return value;
    }),
  );

  return {
    distinctMedia,
    distinctReleaseYears,
    distinctVenues,
    distinctViewingYears,
    initialSort: "viewing-date-desc",
    values: sortViewings(values, "viewing-date-desc"),
  };
}
