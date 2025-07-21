import type { JSX } from "react";

import type { PosterImageProps } from "~/api/posters";
import type { Review, ReviewContent } from "~/api/reviews";
import type { StillImageProps } from "~/api/stills";

import { Grade } from "~/components/Grade";
import { Layout } from "~/components/Layout";
import { MoreReviews } from "~/components/MoreReviews";
import { Still } from "~/components/Still";
import { SubHeading } from "~/components/SubHeading";
import { ccn } from "~/utils/concatClassNames";

import { Content } from "./Content";
import { Credits } from "./Credits";
import { MoreFromCastAndCrew } from "./MoreFromCastAndCrew";
import { MoreInCollections } from "./MoreInCollections";
import { StructuredData } from "./StructuredData";
import { ViewingHistoryListItem } from "./ViewingHistoryListItem";

export const StillImageConfig = {
  height: 540,
  sizes: "(min-width: 1143px) 960px, calc(79.57vw + 13px)",
  width: 960,
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

export type Props = {
  moreFromCastAndCrew: React.ComponentProps<
    typeof MoreFromCastAndCrew
  >["values"];
  moreInCollections: React.ComponentProps<typeof MoreInCollections>["values"];
  moreReviews: React.ComponentProps<typeof MoreReviews>["values"];
  posterImageProps: PosterImageProps;
  searchPosterImageProps: PosterImageProps;
  seoImageSrc: string;
  stillImageProps: StillImageProps;
  value: Review & ReviewContent;
};

export function Review({
  moreFromCastAndCrew,
  moreInCollections,
  moreReviews,
  posterImageProps,
  searchPosterImageProps,
  seoImageSrc,
  stillImageProps,
  value,
}: Props): JSX.Element {
  return (
    <Layout
      className="flex flex-col"
      data-pagefind-body
      data-pagefind-meta={`image:${searchPosterImageProps.src}`}
      hasBackdrop={false}
    >
      <header
        className={`relative z-1 mb-8 flex flex-col items-center px-[8%] pt-10`}
      >
        <nav
          className={`
            transform-gpu pb-3 transition-transform
            has-[a:hover]:scale-110
          `}
        >
          <a
            className={`
              font-sans text-xs tracking-wider text-subtle uppercase
              transition-all
              hover:text-accent
            `}
            href="/reviews/"
          >
            Reviews
          </a>
        </nav>
        <h1
          className={`
            text-center text-4xl
            laptop:text-7xl laptop:tracking-[-1px]
          `}
          data-pagefind-meta="title"
          data-pagefind-weight="10"
        >
          {value.title}
        </h1>
        <OriginalTitle
          className="mb-4 text-muted"
          value={value.originalTitle}
        />
        <Grade className="mb-6" height={24} value={value.grade} />
        <Meta
          className={`
            mb-10
            tablet:mb-12
          `}
          countries={value.countries}
          runtimeMinutes={value.runtimeMinutes}
          year={value.year}
        />
        <Still
          {...StillImageConfig}
          className="mx-auto mb-[.191px]"
          decoding="sync"
          imageProps={stillImageProps}
          loading="eager"
        />
        <div
          className={`
            relative mt-10 bg-default px-[1ch] font-sans text-xs tracking-wide
            text-subtle uppercase
            after:absolute after:top-1/2 after:left-[-11%] after:-z-10
            after:w-[122%] after:border-t after:border-(--fg-subtle)
            tablet:mt-12
          `}
        >
          Reviewed {dateFormat.format(value.date)}
        </div>
      </header>
      <div
        className={`
          flex flex-col items-center gap-16 px-container pb-20
          laptop:gap-20 laptop:pb-32
        `}
      >
        <Content content={value.content} />
        <ViewingHistory value={value} />
        <Credits
          className="w-full max-w-popout"
          countries={value.countries}
          directorNames={value.directorNames}
          originalTitle={value.originalTitle}
          posterImageProps={posterImageProps}
          principalCastNames={value.principalCastNames}
          runtimeMinutes={value.runtimeMinutes}
          title={value.title}
          writerNames={value.writerNames}
          year={value.year}
        />
      </div>
      <div
        className={`
          flex w-full flex-col items-center gap-y-12 bg-subtle pt-16 pb-32
          tablet:pt-8
          laptop:gap-y-24
        `}
        data-pagefind-ignore
      >
        <MoreFromCastAndCrew values={moreFromCastAndCrew} />
        <MoreInCollections values={moreInCollections} />
        <MoreReviews values={moreReviews}>
          <SubHeading as="h2">
            <a
              className={`
                inline-block transform-gpu transition-transform
                hover:scale-110
              `}
              href={`/reviews/`}
            >
              More <span className={`text-accent`}>Reviews</span>
            </a>
          </SubHeading>
        </MoreReviews>
      </div>
      <StructuredData
        directorNames={value.directorNames}
        grade={value.grade}
        imdbId={value.imdbId}
        seoImageSrc={seoImageSrc}
        title={value.title}
        year={value.year}
      />
    </Layout>
  );
}

function Meta({
  className,
  countries,
  runtimeMinutes,
  year,
}: Pick<Review, "countries" | "runtimeMinutes" | "year"> & {
  className?: string;
}) {
  let allCountries;

  for (const country of countries) {
    if (!allCountries) {
      allCountries = <>{country}</>;
      continue;
    }

    allCountries = (
      <>
        {allCountries}
        <span>&ndash;</span>
        {country}
      </>
    );
  }

  return (
    <div
      className={ccn(
        "text-center font-sans text-xs tracking-wide text-subtle uppercase",
        className,
      )}
    >
      {year} <span>|</span> {allCountries} <span>|</span> {runtimeMinutes}
      &#x02009;min{" "}
      <span>
        <span>|</span>{" "}
        <a
          className={`
            inline-block origin-bottom-left transform-gpu text-accent
            transition-transform
            hover:scale-105
          `}
          href="#credits"
        >
          More...
        </a>
      </span>
    </div>
  );
}

function OriginalTitle({
  className,
  value,
}: {
  className: string;
  value: string | undefined;
}) {
  if (!value) {
    return <div className={className} />;
  }

  return <div className={className}>({value})</div>;
}

function ViewingHistory({ value }: Pick<Props, "value">) {
  return (
    <aside className="w-full max-w-popout">
      <SubHeading as="h2" className="text-center shadow-bottom">
        Viewing History
      </SubHeading>
      <ul className="bg-default">
        {value.viewings.map((viewing) => (
          <ViewingHistoryListItem key={viewing.sequence} value={viewing} />
        ))}
      </ul>
    </aside>
  );
}
