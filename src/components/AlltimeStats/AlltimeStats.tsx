import type { AlltimeStats } from "src/api/alltimeStats";
import { DecadeDistribution } from "src/components/DecadeDistribution";
import { MediaDistribution } from "src/components/MediaDistribution";
import { MostWatchedDirectors } from "src/components/MostWatchedDirectors";
import type { MostWatchedMoviesListItemValue } from "src/components/MostWatchedMovies";
import { MostWatchedMovies } from "src/components/MostWatchedMovies";
import type { MostWatchedPeopleListItemValue } from "src/components/MostWatchedPeople";
import { MostWatchedPerformers } from "src/components/MostWatchedPerformers";
import { MostWatchedWriters } from "src/components/MostWatchedWriters";
import { StatsNavigation } from "src/components/StatsNavigation";

import { StatsBackdrop } from "../Backdrop";
import { Layout } from "../Layout";
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
}

export function AlltimeStats({
  stats,
  distinctStatYears,
  mostWatchedMovies,
  mostWatchedDirectors,
  mostWatchedPerformers,
  mostWatchedWriters,
}: Props): JSX.Element {
  return (
    <Layout
      addGradient={false}
      className="flex flex-col items-center bg-subtle"
    >
      <StatsBackdrop
        breadcrumb={<a href="/viewings/">Viewing Log</a>}
        title="All-Time Stats"
        deck={`${(distinctStatYears.length - 1).toString()} Years in Review`}
      >
        <StatsNavigation
          currentYear={"all"}
          linkFunc={(year: string) => {
            return `/viewings/stats/${year}/`;
          }}
          years={distinctStatYears}
          className="mb-8"
        />
        <Callouts
          titleCount={stats.titleCount}
          viewingCount={stats.viewingCount}
          reviewCount={stats.reviewCount}
          watchlistTitlesReviewedCount={stats.watchlistTitlesReviewedCount}
        />
      </StatsBackdrop>
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
