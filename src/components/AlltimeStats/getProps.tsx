import { alltimeStats } from "src/api/alltimeStats";
import { getBackdropImageProps } from "src/api/backdrops";
import { getFluidWidthPosterImageProps } from "src/api/posters";
import { allStatYears } from "src/api/yearStats";
import { BackdropImageConfig } from "src/components/Backdrop";
import { MostWatchedMoviesPosterConfig } from "src/components/MostWatchedMovies";

import { type Props } from "./AlltimeStats";

export async function getProps(): Promise<Props> {
  const stats = await alltimeStats();
  const distinctStatYears = await allStatYears();

  return {
    backdropImageProps: await getBackdropImageProps(
      "stats",
      BackdropImageConfig,
    ),
    deck: `${(distinctStatYears.length - 1).toString()} Years in Review`,
    distinctStatYears,
    mostWatchedDirectors: await Promise.all(
      stats.mostWatchedDirectors.map(async (person) => {
        return {
          ...person,
          viewings: await Promise.all(
            person.viewings.map(async (viewing) => {
              return {
                ...viewing,
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
              return {
                ...viewing,
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
              return {
                ...viewing,
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
