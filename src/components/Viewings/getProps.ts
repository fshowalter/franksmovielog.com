import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { allViewings } from "~/api/viewings";
import { BackdropImageConfig } from "~/components/Backdrop";
import { ListItemPosterImageConfig } from "~/components/ListItemPoster";

import type { ListItemValue, Props } from "./Viewings";

export async function getProps(): Promise<Props & { metaDescription: string }> {
  const {
    distinctGenres,
    distinctMedia,
    distinctReleaseYears,
    distinctVenues,
    distinctViewingYears,
    viewings,
  } = await allViewings();

  viewings.sort((a, b) => b.sequence - a.sequence);

  const values = await Promise.all(
    viewings.map(async (viewing) => {
      const viewingDate = new Date(viewing.viewingDate);
      const value: ListItemValue = {
        genres: viewing.genres,
        medium: viewing.medium,
        posterImageProps: await getFluidWidthPosterImageProps(
          viewing.slug,
          ListItemPosterImageConfig,
        ),
        releaseSequence: viewing.releaseSequence,
        sequence: viewing.sequence,
        slug: viewing.slug,
        sortTitle: viewing.sortTitle,
        title: viewing.title,
        venue: viewing.venue,
        viewingDate: viewingDate.toLocaleString("en-US", {
          day: "numeric",
          timeZone: "UTC",
        }),
        viewingDay: viewingDate.toLocaleString("en-US", {
          timeZone: "UTC",
          weekday: "short",
        }),
        viewingMonth: viewingDate.toLocaleString("en-US", {
          month: "long",
          timeZone: "UTC",
        }),
        viewingMonthShort: viewingDate.toLocaleString("en-US", {
          month: "short",
          timeZone: "UTC",
        }),
        viewingYear: viewing.viewingYear,
        year: viewing.year,
      };

      return value;
    }),
  );

  return {
    backdropImageProps: await getBackdropImageProps(
      "viewings",
      BackdropImageConfig,
    ),
    deck: '"We have such sights to show you!"',
    distinctGenres,
    distinctMedia,
    distinctReleaseYears,
    distinctVenues,
    distinctViewingYears,
    initialSort: "viewing-date-desc",
    metaDescription:
      "A list of every movie I've seen since 2012. Filter by title, release year, viewing year, venue, medium, or genre. Sort by oldest or newest.",
    values,
  };
}
