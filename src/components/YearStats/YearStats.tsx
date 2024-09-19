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

import { Callouts } from "./Callouts";

export interface Props {
  year: string;
  stats: YearStats;
  distinctStatYears: readonly string[];
  mostWatchedMovies: MostWatchedMoviesListItemValue[];
  mostWatchedDirectors: MostWatchedPeopleListItemValue[];
  mostWatchedPerformers: MostWatchedPeopleListItemValue[];
  mostWatchedWriters: MostWatchedPeopleListItemValue[];
}

export function YearStats({
  year,
  stats,
  distinctStatYears,
  mostWatchedMovies,
  mostWatchedDirectors,
  mostWatchedPerformers,
  mostWatchedWriters,
}: Props): JSX.Element {
  return (
    <Layout className="flex flex-col items-center bg-subtle">
      <header className="flex min-h-[240px] w-full flex-col flex-wrap justify-end bg-[#2A2B2A] px-container pb-10 pt-40 text-inverse desktop:min-h-[clamp(640px,50vh,1350px)] desktop:pb-16 desktop:pt-40">
        <div className="mx-auto flex max-w-screen-max flex-col items-center">
          <p className="mb-2 font-sans-narrow text-sm uppercase tracking-[0.8px] underline decoration-subtle decoration-2 underline-offset-8">
            <a href="/viewings/">Viewing Log</a>
          </p>
          <h1 className="mb-4 text-4xl desktop:text-7xl">{`${year} Stats`}</h1>
          <p className="mb-6 font-sans-narrow text-xs uppercase tracking-[1.1px] text-subtle">
            {[...distinctStatYears].reverse()[0] === year
              ? "A year in progress..."
              : "A Year in Review"}
          </p>
          <StatsNavigation
            currentYear={year}
            linkFunc={(year: string) => {
              if (year === "all") {
                return "/viewings/stats/";
              }

              return `/viewings/stats/${year}/`;
            }}
            years={distinctStatYears}
            className="mb-8"
          />
          <Callouts
            titleCount={stats.titleCount}
            newTitleCount={stats.newTitleCount}
            viewingCount={stats.viewingCount}
          />
        </div>
      </header>

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
