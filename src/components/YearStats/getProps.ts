import {
  getFixedWidthPosterImageProps,
  getFluidWidthPosterImageProps,
} from "src/api/posters";
import { allStatYears, statsForYear } from "src/api/yearStats";
import { MostWatchedMoviesPosterConfig } from "src/components/MostWatchedMovies";

import { type Props } from "./YearStats";

export async function getProps(year: string): Promise<Props> {
  const stats = await statsForYear(year);
  const distinctStatYears = await allStatYears();

  return {
    year,
    stats,
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
    mostWatchedDirectors: await Promise.all(
      stats.mostWatchedDirectors.map(async (person) => {
        return {
          ...person,
          viewings: await Promise.all(
            person.viewings.map(async (viewing) => {
              return {
                ...viewing,
                posterImageProps: await getFixedWidthPosterImageProps(
                  viewing.slug,
                  MostWatchedMoviesPosterConfig,
                ),
              };
            }),
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
                posterImageProps: await getFixedWidthPosterImageProps(
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
                posterImageProps: await getFixedWidthPosterImageProps(
                  viewing.slug,
                  MostWatchedMoviesPosterConfig,
                ),
              };
            }),
          ),
        };
      }),
    ),
    distinctStatYears,
  };
}
