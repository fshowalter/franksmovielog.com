import type { AlltimeStats } from "~/api/alltimeStats";
import type { BackdropImageProps } from "~/api/backdrops";
import type { MostWatchedMoviesListItemValue } from "~/components/MostWatchedMovies";
import type { MostWatchedPeopleListItemValue } from "~/components/MostWatchedPeople";

import { Backdrop, BreadcrumbLink } from "~/components/Backdrop";
import { DecadeDistribution } from "~/components/DecadeDistribution";
import { Layout } from "~/components/Layout";
import { MediaDistribution } from "~/components/MediaDistribution";
import { MostWatchedDirectors } from "~/components/MostWatchedDirectors";
import { MostWatchedMovies } from "~/components/MostWatchedMovies";
import { MostWatchedPerformers } from "~/components/MostWatchedPerformers";
import { MostWatchedWriters } from "~/components/MostWatchedWriters";
import { StatsNavigation } from "~/components/StatsNavigation";
import { VenueDistribution } from "~/components/VenueDistribution";

import { Callouts } from "./Callouts";
import { GradeDistribution } from "./GradeDistribution";

export type Props = {
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
}: Props): JSX.Element {
  return (
    <Layout
      addGradient={false}
      className="flex flex-col items-center bg-subtle"
    >
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
      <Callouts
        reviewCount={stats.reviewCount}
        titleCount={stats.titleCount}
        viewingCount={stats.viewingCount}
        watchlistTitlesReviewedCount={stats.watchlistTitlesReviewedCount}
      />
      <div className="mx-auto flex w-full max-w-screen-max flex-col items-stretch gap-y-8 py-10 tablet:px-container">
        <MostWatchedMovies
          className="mx-auto w-full"
          values={mostWatchedMovies}
        />
        <div className="flex flex-col items-start gap-y-8 desktop:flex-row desktop:gap-x-8">
          <GradeDistribution values={stats.gradeDistribution} />
          <DecadeDistribution values={stats.decadeDistribution} />
        </div>
        <div className="mx-auto flex w-full flex-col gap-y-8 desktop:max-w-[calc(66%_+_24px)]">
          <MediaDistribution values={stats.mediaDistribution} />
          <VenueDistribution values={stats.venueDistribution} />
          <MostWatchedDirectors values={mostWatchedDirectors} />
          <MostWatchedPerformers values={mostWatchedPerformers} />
          <MostWatchedWriters values={mostWatchedWriters} />
        </div>
      </div>
    </Layout>
  );
}
