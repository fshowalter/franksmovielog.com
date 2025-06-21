import type { JSX } from "react";

import type { BackdropImageProps } from "~/api/backdrops";
import type { YearStats } from "~/api/yearStats";
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

export type Props = {
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
}: Props): JSX.Element {
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
      <Callouts
        newTitleCount={stats.newTitleCount}
        titleCount={stats.titleCount}
        viewingCount={stats.viewingCount}
      />
      <div className="mx-auto flex w-full max-w-(--breakpoint-max) flex-col items-stretch gap-y-8 py-10 tablet:px-container">
        <MostWatchedMovies
          className="mx-auto w-full"
          values={mostWatchedMovies}
        />
        <div className="mx-auto flex w-full flex-col items-start gap-y-8 desktop:flex-row desktop:gap-x-8">
          <DecadeDistribution values={stats.decadeDistribution} />
          <MediaDistribution values={stats.mediaDistribution} />
          <VenueDistribution values={stats.venueDistribution} />
        </div>
        <div className="mx-auto flex w-full flex-col gap-y-8 desktop:max-w-[calc(66%+24px)]">
          <MostWatchedDirectors values={mostWatchedDirectors} />
          <MostWatchedPerformers values={mostWatchedPerformers} />
          <MostWatchedWriters values={mostWatchedWriters} />
        </div>
      </div>
    </Layout>
  );
}
