import type { AlltimeStats } from "src/api/alltimeStats";
import type { BackdropImageProps } from "src/api/backdrops";
import { Backdrop, BreadcrumbLink } from "src/components/Backdrop";
import { DecadeDistribution } from "src/components/DecadeDistribution";
import { Layout } from "src/components/Layout";
import { MediaDistribution } from "src/components/MediaDistribution";
import { MostWatchedDirectors } from "src/components/MostWatchedDirectors";
import type { MostWatchedMoviesListItemValue } from "src/components/MostWatchedMovies";
import { MostWatchedMovies } from "src/components/MostWatchedMovies";
import type { MostWatchedPeopleListItemValue } from "src/components/MostWatchedPeople";
import { MostWatchedPerformers } from "src/components/MostWatchedPerformers";
import { MostWatchedWriters } from "src/components/MostWatchedWriters";
import { StatsNavigation } from "src/components/StatsNavigation";

import { Callouts } from "./Callouts";
import { GradeDistribution } from "./GradeDistribution";

export interface Props {
  stats: Pick<
    AlltimeStats,
    | "decadeDistribution"
    | "gradeDistribution"
    | "mediaDistribution"
    | "reviewCount"
    | "titleCount"
    | "viewingCount"
    | "watchlistTitlesReviewedCount"
  >;
  mostWatchedMovies: MostWatchedMoviesListItemValue[];
  mostWatchedDirectors: MostWatchedPeopleListItemValue[];
  mostWatchedPerformers: MostWatchedPeopleListItemValue[];
  mostWatchedWriters: MostWatchedPeopleListItemValue[];
  distinctStatYears: readonly string[];
  backdropImageProps: BackdropImageProps;
  deck: string;
}

export function AlltimeStats({
  stats,
  distinctStatYears,
  mostWatchedMovies,
  mostWatchedDirectors,
  mostWatchedPerformers,
  mostWatchedWriters,
  backdropImageProps,
  deck,
}: Props): JSX.Element {
  return (
    <Layout
      addGradient={false}
      className="flex flex-col items-center bg-subtle"
    >
      <Backdrop
        imageProps={backdropImageProps}
        breadcrumb={
          <BreadcrumbLink href="/viewings/">Viewing Log</BreadcrumbLink>
        }
        title="All-Time Stats"
        deck={deck}
      />
      <StatsNavigation
        currentYear={"all"}
        linkFunc={(year: string) => {
          return `/viewings/stats/${year}/`;
        }}
        years={distinctStatYears}
        className="mb-12 w-full"
      />
      <Callouts
        titleCount={stats.titleCount}
        viewingCount={stats.viewingCount}
        reviewCount={stats.reviewCount}
        watchlistTitlesReviewedCount={stats.watchlistTitlesReviewedCount}
      />
      <div className="mx-auto flex w-full max-w-screen-max flex-col items-stretch gap-y-8 py-10 tablet:px-container">
        <MostWatchedMovies
          values={mostWatchedMovies}
          className="mx-auto w-full"
        />
        <div className="flex flex-col items-start gap-y-8 desktop:flex-row desktop:gap-x-8">
          <DecadeDistribution values={stats.decadeDistribution} />
          <MediaDistribution values={stats.mediaDistribution} />
          <GradeDistribution values={stats.gradeDistribution} />
        </div>
        <div className="mx-auto flex w-full flex-col gap-y-8 desktop:max-w-[calc(66%_+_24px)]">
          <MostWatchedDirectors values={mostWatchedDirectors} />
          <MostWatchedPerformers values={mostWatchedPerformers} />
          <MostWatchedWriters values={mostWatchedWriters} />
        </div>
      </div>
    </Layout>
  );
}
