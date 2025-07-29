import { alltimeStats } from "~/api/alltimeStats";
import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { allStatYears } from "~/api/yearStats";
import { BackdropImageConfig } from "~/components/Backdrop";
import { MostWatchedMoviesPosterConfig } from "~/components/MostWatchedMovies";

import { type Props } from "./AlltimeStats";

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
              const viewingDate = new Date(viewing.date);
              return {
                ...viewing,
                displayDate: `${viewingDate.toLocaleDateString("en-US", {
                  timeZone: "UTC",
                  year: "numeric",
                })}-${viewingDate.toLocaleDateString("en-US", {
                  month: "short",
                  timeZone: "UTC",
                })}-${viewingDate.toLocaleDateString("en-US", {
                  day: "2-digit",
                  timeZone: "UTC",
                })}`,
                posterImageProps: await getFluidWidthPosterImageProps(
                  viewing.slug,
                  MostWatchedMoviesPosterConfig,
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
            MostWatchedMoviesPosterConfig,
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
              const viewingDate = new Date(viewing.date);
              return {
                ...viewing,
                displayDate: `${viewingDate.toLocaleDateString("en-US", {
                  timeZone: "UTC",
                  year: "numeric",
                })}-${viewingDate.toLocaleDateString("en-US", {
                  month: "short",
                  timeZone: "UTC",
                })}-${viewingDate.toLocaleDateString("en-US", {
                  day: "2-digit",
                  timeZone: "UTC",
                })}`,
                posterImageProps: await getFluidWidthPosterImageProps(
                  viewing.slug,
                  MostWatchedMoviesPosterConfig,
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
              const viewingDate = new Date(viewing.date);
              return {
                ...viewing,
                displayDate: `${viewingDate.toLocaleDateString("en-US", {
                  timeZone: "UTC",
                  year: "numeric",
                })}-${viewingDate.toLocaleDateString("en-US", {
                  month: "short",
                  timeZone: "UTC",
                })}-${viewingDate.toLocaleDateString("en-US", {
                  day: "2-digit",
                  timeZone: "UTC",
                })}`,
                posterImageProps: await getFluidWidthPosterImageProps(
                  viewing.slug,
                  MostWatchedMoviesPosterConfig,
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
