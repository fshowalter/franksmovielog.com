import type { BackdropImageProps } from "~/api/backdrops";
import type { AlltimeStats } from "~/api/stats";

import { Backdrop, BreadcrumbLink } from "~/components/backdrop/Backdrop";
import { Layout } from "~/components/layout/Layout";

import type { MostWatchedMoviesListItemValue } from "./MostWatchedMovies";
import type { MostWatchedPeopleListItemValue } from "./MostWatchedPeople";

import { CalloutsGrid } from "./CalloutsGrid";
import { DecadeDistribution } from "./DecadeDistribution";
import { GradeDistribution } from "./GradeDistribution";
import { MediaDistribution } from "./MediaDistribution";
import { MostWatchedDirectors } from "./MostWatchedDirectors";
import { MostWatchedMovies } from "./MostWatchedMovies";
import { MostWatchedPerformers } from "./MostWatchedPerformers";
import { MostWatchedWriters } from "./MostWatchedWriters";
import { StatsNavigation } from "./StatsNavigation";
import { VenueDistribution } from "./VenueDistribution";

export type AllTimeStatsProps = {
  backdropImageProps: BackdropImageProps;
  deck: string;
  distinctStatYears: readonly string[];
  mostWatchedDirectors: MostWatchedPeopleListItemValue[];
  mostWatchedMovies: MostWatchedMoviesListItemValue[];
  mostWatchedPerformers: MostWatchedPeopleListItemValue[];
  mostWatchedWriters: MostWatchedPeopleListItemValue[];
  stats: Pick<
    AlltimeStats,
    | "decadeDistribution"
    | "gradeDistribution"
    | "mediaDistribution"
    | "reviewCount"
    | "titleCount"
    | "venueDistribution"
    | "viewingCount"
    | "watchlistTitlesReviewedCount"
  >;
};

export function AlltimeStats({
  backdropImageProps,
  deck,
  distinctStatYears,
  mostWatchedDirectors,
  mostWatchedMovies,
  mostWatchedPerformers,
  mostWatchedWriters,
  stats,
}: AllTimeStatsProps): React.JSX.Element {
  return (
    <Layout className="flex flex-col items-center bg-subtle">
      <Backdrop
        breadcrumb={
          <BreadcrumbLink href="/viewings/">Viewing Log</BreadcrumbLink>
        }
        deck={deck}
        imageProps={backdropImageProps}
        title="All-Time Stats"
      />
      <StatsNavigation
        className="mb-12 w-full"
        currentYear={"all"}
        linkFunc={(year: string) => {
          return `/viewings/stats/${year}/`;
        }}
        years={distinctStatYears}
      />
      <CalloutsGrid
        stats={[
          { label: "Viewings", value: stats.viewingCount },
          { label: "Movies", value: stats.titleCount },
          { label: "Reviews", value: stats.reviewCount },
          {
            label: "From Watchlist",
            value: stats.watchlistTitlesReviewedCount,
          },
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
            mx-auto flex w-full max-w-popout flex-col items-start gap-y-8
            laptop:max-w-unset laptop:flex-row laptop:gap-x-8
          `}
        >
          <GradeDistribution values={stats.gradeDistribution} />
          <DecadeDistribution values={stats.decadeDistribution} />
        </div>
        <div
          className={`
            mx-auto flex w-full max-w-popout flex-col items-start gap-y-8
            laptop:max-w-unset laptop:flex-row laptop:gap-x-8
          `}
        >
          <MediaDistribution values={stats.mediaDistribution} />
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
