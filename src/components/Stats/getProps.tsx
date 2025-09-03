import type { MostWatchedPerson } from "~/api/data/MostWatchedPersonSchema";
import type { MostWatchedTitle } from "~/api/data/MostWatchedTitleSchema";
import type { MostWatchedMoviesListItemValue } from "~/components/Stats/MostWatchedMovies";
import type { MostWatchedPeopleListItemValue } from "~/components/Stats/MostWatchedPeople";

import { getBackdropImageProps } from "~/api/backdrops";
import { getFluidWidthPosterImageProps } from "~/api/posters";
import { allStatYears, alltimeStats, statsForYear } from "~/api/stats";
import { BackdropImageConfig } from "~/components/Backdrop";
import { PosterListItemImageConfig } from "~/components/PosterList";
import { displayDate } from "~/utils/displayDate";

import type { AllTimeStatsProps } from "./AlltimeStats";
import type { YearStatsProps } from "./YearStats";

export async function getAllTimeStatsProps(): Promise<
  AllTimeStatsProps & { metaDescription: string }
> {
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
    mostWatchedDirectors: await createMostWatchedPeopleListItemValueProps(
      stats.mostWatchedDirectors,
    ),
    mostWatchedMovies: await createMostWatchMoviesListItemValueProps(
      stats.mostWatchedTitles,
    ),
    mostWatchedPerformers: await createMostWatchedPeopleListItemValueProps(
      stats.mostWatchedPerformers,
    ),
    mostWatchedWriters: await createMostWatchedPeopleListItemValueProps(
      stats.mostWatchedWriters,
    ),
    stats,
  };
}

export async function getYearStatsProps(
  year: string,
): Promise<YearStatsProps & { metaDescription: string }> {
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
    mostWatchedDirectors: await createMostWatchedPeopleListItemValueProps(
      stats.mostWatchedDirectors,
    ),
    mostWatchedMovies: await createMostWatchMoviesListItemValueProps(
      stats.mostWatchedTitles,
    ),
    mostWatchedPerformers: await createMostWatchedPeopleListItemValueProps(
      stats.mostWatchedPerformers,
    ),
    mostWatchedWriters: await createMostWatchedPeopleListItemValueProps(
      stats.mostWatchedWriters,
    ),
    stats,
    year,
  };
}

async function createMostWatchedPeopleListItemValueProps(
  people: MostWatchedPerson[],
): Promise<MostWatchedPeopleListItemValue[]> {
  return Promise.all(
    people.map(async (person) => {
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
  );
}

async function createMostWatchMoviesListItemValueProps(
  titles: MostWatchedTitle[],
): Promise<MostWatchedMoviesListItemValue[]> {
  return await Promise.all(
    titles.map(async (title) => {
      return {
        ...title,
        posterImageProps: await getFluidWidthPosterImageProps(
          title.slug,
          PosterListItemImageConfig,
        ),
      };
    }),
  );
}
