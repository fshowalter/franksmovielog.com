import { getBackdropImageProps } from "src/api/backdrops";
import { getFluidWidthPosterImageProps } from "src/api/posters";
import { allViewings } from "src/api/viewings";
import { BackdropImageConfig } from "src/components/Backdrop";
import { ListItemPosterImageConfig } from "src/components/ListItemPoster";

import type { ListItemValue, Props } from "./Viewings";

export async function getProps(): Promise<Props> {
  const {
    viewings,
    distinctGenres,
    distinctReleaseYears,
    distinctMedia,
    distinctVenues,
    distinctViewingYears,
  } = await allViewings();

  viewings.sort((a, b) => b.sequence - a.sequence);

  const values = await Promise.all(
    viewings.map(async (viewing) => {
      const viewingDate = new Date(viewing.viewingDate);
      const value: ListItemValue = {
        viewingDate: viewingDate.toLocaleString("en-US", {
          day: "numeric",
          timeZone: "UTC",
        }),
        viewingMonth: viewingDate.toLocaleString("en-US", {
          month: "long",
          timeZone: "UTC",
        }),
        viewingDay: viewingDate.toLocaleString("en-US", {
          weekday: "short",
          timeZone: "UTC",
        }),
        title: viewing.title,
        year: viewing.year,
        slug: viewing.slug,
        genres: viewing.genres,
        releaseSequence: viewing.releaseSequence,
        sortTitle: viewing.sortTitle,
        viewingYear: viewing.viewingYear,
        venue: viewing.venue,
        medium: viewing.medium,
        sequence: viewing.sequence,
        posterImageProps: await getFluidWidthPosterImageProps(
          viewing.slug,
          ListItemPosterImageConfig,
        ),
      };

      return value;
    }),
  );

  return {
    deck: '"We have such sights to show you!"',
    values,
    distinctGenres,
    distinctMedia,
    distinctReleaseYears,
    distinctVenues,
    distinctViewingYears,
    initialSort: "viewing-date-desc",
    backdropImageProps: await getBackdropImageProps(
      "viewings",
      BackdropImageConfig,
    ),
  };
}
