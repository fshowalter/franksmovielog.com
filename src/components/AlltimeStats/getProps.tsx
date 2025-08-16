import { alltimeStats } from "~/api/alltimeStats";
import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { allStatYears } from "~/api/yearStats";
import { BackdropImageConfig } from "~/components/Backdrop";
import { PosterListItemImageConfig } from "~/components/PosterList";
import { displayDate } from "~/utils/displayDate";

import type { Props } from "./AlltimeStats";

export async function getProps(): Promise<Props & { metaDescription: string }> {
  const stats = await alltimeStats();
  const distinctStatYears = await allStatYears();

  return {
    backdropImageProps: await getBackdropImageProps(
      "stats",
      BackdropImageConfig,
    ),
    deck: `${(distinctStatYears.length - 1).toString()} Years in Review`,
    distinctStatYears,
    metaDescription:
      "My all-time viewing stats. Includes my most-watched movies, directors, performers, and writers, as well as grade, venue, release year, and media distributions.",
    mostWatchedDirectors: await Promise.all(
      stats.mostWatchedDirectors.map(async (person) => {
        return {
          ...person,
          viewings: await Promise.all(
            person.viewings.map(async (viewing) => {
              return {
                ...viewing,
                displayDate: displayDate(viewing.viewingDate),
                posterImageProps: await getFluidWidthPosterImageProps(
                  viewing.slug,
                  PosterListItemImageConfig,
                ),
              };
            }),
          ),
        };
      }),
    ),
    mostWatchedMovies: await Promise.all(
      stats.mostWatchedTitles.map(async (title) => {
        return {
          ...title,
          posterImageProps: await getFluidWidthPosterImageProps(
            title.slug,
            PosterListItemImageConfig,
          ),
        };
      }),
    ),
    mostWatchedPerformers: await Promise.all(
      stats.mostWatchedPerformers.map(async (person) => {
        return {
          ...person,
          viewings: await Promise.all(
            person.viewings.map(async (viewing) => {
              return {
                ...viewing,
                displayDate: displayDate(viewing.viewingDate),
                posterImageProps: await getFluidWidthPosterImageProps(
                  viewing.slug,
                  PosterListItemImageConfig,
                ),
              };
            }),
          ),
        };
      }),
    ),
    mostWatchedWriters: await Promise.all(
      stats.mostWatchedWriters.map(async (person) => {
        return {
          ...person,
          viewings: await Promise.all(
            person.viewings.map(async (viewing) => {
              return {
                ...viewing,
                displayDate: displayDate(viewing.viewingDate),
                posterImageProps: await getFluidWidthPosterImageProps(
                  viewing.slug,
                  PosterListItemImageConfig,
                ),
              };
            }),
          ),
        };
      }),
    ),
    stats,
  };
}
