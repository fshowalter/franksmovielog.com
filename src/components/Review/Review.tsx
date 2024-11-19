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
  height: 864,
  sizes:
    "(max-width: 767px) calc(100vw - 16%), (max-width: 1279px) calc(100vw - 48px), 1536px",
  width: 1536,
};

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
      <header className="mb-12 flex flex-col items-center px-[8%] pt-10">
        <h1
          className="text-center text-4xl desktop:text-7xl"
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
          className="mb-12"
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
      </header>
      <div className="flex flex-col items-center gap-16 px-container pb-20 desktop:gap-20 desktop:pb-32">
        <Content content={value.content} />
        <div className="w-full max-w-popout">
          <SubHeading as="h2" className="shadow-bottom">
            Viewing History
          </SubHeading>
          <ul>
            {value.viewings.map((viewing) => (
              <ViewingHistoryListItem key={viewing.sequence} value={viewing} />
            ))}
          </ul>
        </div>
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
        className="flex w-full flex-col items-center gap-y-12 bg-subtle pb-32 pt-16 tablet:pt-8 desktop:gap-y-24"
        data-pagefind-ignore
      >
        <MoreFromCastAndCrew values={moreFromCastAndCrew} />
        <MoreInCollections values={moreInCollections} />
        <MoreReviews values={moreReviews}>
          <SubHeading as="h2">
            More{" "}
            <a className="text-accent" href={`/reviews/`}>
              Reviews
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
        "text-center font-sans text-xs font-light uppercase tracking-wide text-subtle",
        className,
      )}
    >
      {year} <span>|</span> {allCountries} <span>|</span> {runtimeMinutes}
      &#x02009;min{" "}
      <span>
        <span>|</span> <a href="#credits">More...</a>
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
