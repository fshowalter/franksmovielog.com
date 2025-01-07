import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { allStatYears, statsForYear } from "~/api/yearStats";
import { BackdropImageConfig } from "~/components/Backdrop";
import { MostWatchedMoviesPosterConfig } from "~/components/MostWatchedMovies";

import { type Props } from "./YearStats";

export async function getProps(
  year: string,
): Promise<Props & { metaDescription: string }> {
  const stats = await statsForYear(year);
  const distinctStatYears = await allStatYears();

  return {
    backdropImageProps: await getBackdropImageProps(year, BackdropImageConfig),
    deck:
      [...distinctStatYears].reverse()[0] === year
        ? "A Year in Progress..."
        : "A Year in Review",
    distinctStatYears,
    metaDescription: `My ${year} viewing stats. Includes my most-watched movies, directors, performers, and writers; as well as venue, release year, and media distributions.`,
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
    year,
  };
}
