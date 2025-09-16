import type { BackdropImageProps } from "~/api/backdrops";
import type { YearStats } from "~/api/stats";

import { Backdrop, BreadcrumbLink } from "~/components/Backdrop";
import { Layout } from "~/components/layout/Layout";

import type { MostWatchedMoviesListItemValue } from "./MostWatchedMovies";
import type { MostWatchedPeopleListItemValue } from "./MostWatchedPeople";

import { CalloutsGrid } from "./CalloutsGrid";
import { DecadeDistribution } from "./DecadeDistribution";
import { MediaDistribution } from "./MediaDistribution";
import { MostWatchedDirectors } from "./MostWatchedDirectors";
import { MostWatchedMovies } from "./MostWatchedMovies";
import { MostWatchedPerformers } from "./MostWatchedPerformers";
import { MostWatchedWriters } from "./MostWatchedWriters";
import { StatsNavigation } from "./StatsNavigation";
import { VenueDistribution } from "./VenueDistribution";

export type YearStatsProps = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  distinctStatYears: readonly string[];
  mostWatchedDirectors: MostWatchedPeopleListItemValue[];
  mostWatchedMovies: MostWatchedMoviesListItemValue[];
  mostWatchedPerformers: MostWatchedPeopleListItemValue[];
  mostWatchedWriters: MostWatchedPeopleListItemValue[];
  stats: YearStats;
  year: string;
};

export function YearStats({
  backdropImageProps,
  deck,
  distinctStatYears,
  mostWatchedDirectors,
  mostWatchedMovies,
  mostWatchedPerformers,
  mostWatchedWriters,
  stats,
  year,
}: YearStatsProps): React.JSX.Element {
  return (
    <Layout className="flex flex-col items-center bg-subtle">
      <Backdrop
        breadcrumb={
          <BreadcrumbLink href="/viewings/">Viewing Log</BreadcrumbLink>
        }
        deck={deck}
        imageProps={backdropImageProps}
        title={`${year} Stats`}
      />
      <StatsNavigation
        className="mb-12 w-full"
        currentYear={year}
        linkFunc={(year: string) => {
          if (year === "all") {
            return "/viewings/stats/";
          }

          return `/viewings/stats/${year}/`;
        }}
        years={distinctStatYears}
      />
      <CalloutsGrid
        stats={[
          { label: "Viewings", value: stats.viewingCount },
          { label: "Movies", value: stats.titleCount },
          { label: "New Movies", value: stats.newTitleCount },
        ]}
      />
      <div
        className={`
          mx-auto flex w-full max-w-(--breakpoint-desktop) flex-col
          items-stretch gap-y-8 py-10
          tablet:px-container
        `}
      >
        <MostWatchedMovies
          className="mx-auto w-full"
          values={mostWatchedMovies}
        />
        <div
          className={`
            mx-auto flex w-full max-w-popout grid-cols-2 flex-col items-start
            gap-y-8
            laptop:grid laptop:max-w-unset laptop:gap-x-8
          `}
        >
          <DecadeDistribution values={stats.decadeDistribution} />
          <MediaDistribution values={stats.mediaDistribution} />
        </div>
        <div className="mx-auto w-full max-w-popout">
          <VenueDistribution values={stats.venueDistribution} />
        </div>
        <div className={`mx-auto flex w-full max-w-popout flex-col gap-y-8`}>
          <MostWatchedDirectors values={mostWatchedDirectors} />
          <MostWatchedPerformers values={mostWatchedPerformers} />
          <MostWatchedWriters values={mostWatchedWriters} />
        </div>
      </div>
    </Layout>
  );
}
