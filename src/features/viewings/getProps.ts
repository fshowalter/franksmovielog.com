import type { BackdropImageProps } from "~/api/backdrops";

import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { allViewings } from "~/api/viewings";
import { BackdropImageConfig } from "~/components/backdrop/Backdrop";
import { PosterListItemImageConfig } from "~/components/poster-list/PosterListItem";

import type { ViewingsProps, ViewingsValue } from "./Viewings";

import { sortViewings } from "./sortViewings";

type PageProps = ViewingsProps & {
  backdropImageProps: BackdropImageProps;
  deck: string;
  metaDescription: string;
};

export async function getProps(): Promise<PageProps> {
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
    backdropImageProps: await getBackdropImageProps(
      "viewings",
      BackdropImageConfig,
    ),
    deck: '"We have such sights to show you!"',
    distinctMedia,
    distinctReleaseYears,
    distinctVenues,
    distinctViewingYears,
    initialSort: "viewing-date-desc",
    metaDescription:
      "A list of every movie I've seen since 2012. Filter by title, release year, viewing year, venue, medium, or genre. Sort by oldest or newest.",
    values: sortViewings(values, "viewing-date-desc"),
  };
}
