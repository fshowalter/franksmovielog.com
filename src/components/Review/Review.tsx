import type { PosterImageProps } from "src/api/posters";
import type { Review, ReviewContent } from "src/api/reviews";
import type { StillImageProps } from "src/api/stills";
import { Grade } from "src/components/Grade";
import { Layout } from "src/components/Layout";
import { MoreReviews } from "src/components/MoreReviews";
import { Still } from "src/components/Still";
import { SubHeading } from "src/components/SubHeading";
import { ccn } from "src/utils/concatClassNames";

import { Content } from "./Content";
import { Credits } from "./Credits";
import { MoreFromCastAndCrew } from "./MoreFromCastAndCrew";
import { MoreInCollections } from "./MoreInCollections";
import { StructuredData } from "./StructuredData";
import { ViewingHistoryListItem } from "./ViewingHistoryListItem";

export const StillImageConfig = {
  width: 1536,
  height: 864,
  sizes:
    "(max-width: 767px) calc(100vw - 16%), (max-width: 1279px) calc(100vw - 48px), 1536px",
};

export interface Props {
  value: Review & ReviewContent;
  stillImageProps: StillImageProps;
  posterImageProps: PosterImageProps;
  moreFromCastAndCrew: React.ComponentProps<
    typeof MoreFromCastAndCrew
  >["values"];
  moreInCollections: React.ComponentProps<typeof MoreInCollections>["values"];
  moreReviews: React.ComponentProps<typeof MoreReviews>["values"];
  seoImageSrc: string;
}

export function Review({
  value,
  stillImageProps,
  posterImageProps,
  seoImageSrc,
  moreFromCastAndCrew,
  moreInCollections,
  moreReviews,
}: Props): JSX.Element {
  return (
    <Layout hasBackdrop={false} className="flex flex-col" data-pagefind-body>
      <header className="mb-12 flex flex-col items-center px-container-base pt-10">
        <h1
          data-pagefind-meta="title"
          className="text-center text-4xl desktop:text-7xl"
        >
          {value.title}
        </h1>
        <OriginalTitle
          className="mb-4 text-muted"
          value={value.originalTitle}
        />
        <Grade value={value.grade} height={24} className="mb-6" />
        <Meta
          year={value.year}
          countries={value.countries}
          runtimeMinutes={value.runtimeMinutes}
          className="mb-12"
        />
        <Still
          title={value.title}
          year={value.year}
          width={StillImageConfig.width}
          height={StillImageConfig.height}
          sizes={StillImageConfig.sizes}
          className="mx-auto mb-[5.33px]"
          imageProps={stillImageProps}
          loading="eager"
          decoding="sync"
        />
      </header>
      <div className="flex flex-col items-center gap-16 px-container-base pb-20 desktop:gap-20 desktop:pb-32">
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
          title={value.title}
          year={value.year}
          directorNames={value.directorNames}
          principalCastNames={value.principalCastNames}
          writerNames={value.writerNames}
          originalTitle={value.originalTitle}
          runtimeMinutes={value.runtimeMinutes}
          countries={value.countries}
          posterImageProps={posterImageProps}
          className="w-full max-w-popout"
        />
      </div>
      <div
        data-pagefind-ignore
        className="flex w-full flex-col items-center gap-y-12 bg-subtle pb-32 pt-16 tablet:pt-8 desktop:gap-y-24"
      >
        <MoreFromCastAndCrew values={moreFromCastAndCrew} />
        <MoreInCollections values={moreInCollections} />
        <MoreReviews values={moreReviews}>
          <SubHeading as="h2">
            More{" "}
            <a href={`/reviews/`} className="text-accent">
              Reviews
            </a>
          </SubHeading>
        </MoreReviews>
      </div>
      <StructuredData
        title={value.title}
        year={value.year}
        directorNames={value.directorNames}
        imdbId={value.imdbId}
        grade={value.grade}
        seoImageSrc={seoImageSrc}
      />
    </Layout>
  );
}

function OriginalTitle({
  value,
  className,
}: {
  className: string;
  value: string | null;
}) {
  if (!value) {
    return <div className={className} />;
  }

  return <div className={className}>({value})</div>;
}

function Meta({
  year,
  countries,
  runtimeMinutes,
  className,
}: Pick<Review, "year" | "countries" | "runtimeMinutes"> & {
  className?: string;
}) {
  return (
    <div
      className={ccn(
        "text-center font-sans-narrow text-xs font-medium uppercase tracking-[.6px] text-subtle",
        className,
      )}
    >
      {year} <span>|</span>{" "}
      {countries.reduce<JSX.Element | null>((acc, country) => {
        if (acc === null) {
          return <>{country}</>;
        }

        return (
          <>
            {acc}
            <span>&ndash;</span>
            {country}
          </>
        );
      }, null)}{" "}
      <span>|</span> {runtimeMinutes}
      &#x02009;min{" "}
      <span>
        <span>|</span> <a href="#credits">More...</a>
      </span>
    </div>
  );
}
