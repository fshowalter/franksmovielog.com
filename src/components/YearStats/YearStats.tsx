import type { BackdropImageProps } from "src/api/backdrops";
import type { YearStats } from "src/api/yearStats";
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

import { Backdrop } from "../Backdrop";
import { Callouts } from "./Callouts";

export interface Props {
  year: string;
  stats: YearStats;
  distinctStatYears: readonly string[];
  mostWatchedMovies: MostWatchedMoviesListItemValue[];
  mostWatchedDirectors: MostWatchedPeopleListItemValue[];
  mostWatchedPerformers: MostWatchedPeopleListItemValue[];
  mostWatchedWriters: MostWatchedPeopleListItemValue[];
  backdropImageProps: BackdropImageProps;
}

export function YearStats({
  year,
  stats,
  distinctStatYears,
  mostWatchedMovies,
  mostWatchedDirectors,
  mostWatchedPerformers,
  mostWatchedWriters,
  backdropImageProps,
}: Props): JSX.Element {
  return (
    <Layout
      addGradient={false}
      className="flex flex-col items-center bg-subtle"
    >
      <Backdrop
        imageProps={backdropImageProps}
        breadcrumb={<a href="/viewings/">Viewing Log</a>}
        title={`${year} Stats`}
        deck={
          [...distinctStatYears].reverse()[0] === year
            ? "A Year in Progress..."
            : "A Year in Review"
        }
      />
      <StatsNavigation
        currentYear={year}
        linkFunc={(year: string) => {
          if (year === "all") {
            return "/viewings/stats/";
          }

          return `/viewings/stats/${year}/`;
        }}
        years={distinctStatYears}
        className="mb-12 w-full"
      />
      <Callouts
        titleCount={stats.titleCount}
        newTitleCount={stats.newTitleCount}
        viewingCount={stats.viewingCount}
      />
      <div className="mx-auto flex w-full max-w-screen-max flex-col items-stretch gap-y-8 py-10 tablet:px-container">
        <MostWatchedMovies
          values={mostWatchedMovies}
          className="mx-auto w-full"
        />
        <div className="mx-auto flex w-full flex-col items-start gap-y-8 desktop:max-w-[calc(66%_+_24px)] desktop:flex-row desktop:gap-x-8">
          <DecadeDistribution values={stats.decadeDistribution} />
          <MediaDistribution values={stats.mediaDistribution} />
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
