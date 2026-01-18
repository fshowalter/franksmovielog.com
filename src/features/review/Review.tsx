import type { PosterImageProps } from "~/api/posters";
import type { Review, ReviewContent } from "~/api/reviews";
import type { StillImageProps } from "~/api/stills";

import { Grade } from "~/components/grade/Grade";
import { MoreReviews } from "~/components/more-reviews/MoreReviews";
import { Still } from "~/components/still/Still";
import { SubHeading } from "~/components/sub-heading/SubHeading";

import { Content } from "./Content";
import { Credits } from "./Credits";
import { MoreFromCastAndCrew } from "./MoreFromCastAndCrew";
import { MoreInCollections } from "./MoreInCollections";
import { StructuredData } from "./StructuredData";
import { ViewingHistoryListItem } from "./ViewingHistoryListItem";

/**
 * Configuration for still images in reviews.
 */
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

/**
 * Props for the Review component.
 */
export type ReviewProps = {
  moreFromCastAndCrew: React.ComponentProps<
    typeof MoreFromCastAndCrew
  >["values"];
  moreInCollections: React.ComponentProps<typeof MoreInCollections>["values"];
  moreReviews: React.ComponentProps<typeof MoreReviews>["values"];
  posterImageProps: PosterImageProps;
  seoImageSrc: string;
  stillImageProps: StillImageProps;
  value: Review & ReviewContent;
};

/**
 * Component for displaying a single review with related content.
 * @param props - Component props
 * @param props.moreFromCastAndCrew - Related reviews from cast and crew
 * @param props.moreInCollections - Related reviews from collections
 * @param props.moreReviews - More reviews to display
 * @param props.posterImageProps - Poster image configuration
 * @param props.seoImageSrc - SEO image source URL
 * @param props.stillImageProps - Still image configuration
 * @param props.value - Review data and content
 * @returns Review component with structured data and related content
 */
export function Review({
  moreFromCastAndCrew,
  moreInCollections,
  moreReviews,
  posterImageProps,
  seoImageSrc,
  stillImageProps,
  value,
}: ReviewProps): React.JSX.Element {
  return (
    <>
      <header
        className={`
          relative z-base mb-8 flex flex-col items-center px-[8%] pt-10
        `}
      >
        <nav className={`transform-gpu pb-2 transition-transform`}>
          <a
            className={`
              relative inline-block pb-1 font-sans text-[13px] tracking-wider
              text-subtle uppercase transition-all
              after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
              after:origin-center after:scale-x-0 after:bg-accent
              after:transition-transform
              hover:text-accent
              hover:after:scale-x-100
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
          className="mb-4 text-center text-muted"
          value={value.originalTitle}
        />
        <Grade className="mb-6" height={24} value={value.grade} />
        <Meta
          className={`
            mb-10
            tablet:mb-12
          `}
          countries={value.countries}
          releaseYear={value.releaseYear}
          runtimeMinutes={value.runtimeMinutes}
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
            after:absolute after:top-1/2 after:left-[-11%] after:z-behind
            after:w-[122%] after:border-t after:border-(--fg-subtle)
            tablet:mt-12
          `}
        >
          Reviewed {dateFormat.format(value.reviewDate)}
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
          releaseYear={value.releaseYear}
          runtimeMinutes={value.runtimeMinutes}
          title={value.title}
          writerNames={value.writerNames}
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
                relative -mb-1 inline-block transform-gpu pb-1
                transition-transform
                after:absolute after:bottom-0 after:left-0 after:h-px
                after:w-full after:origin-center after:scale-x-0 after:bg-accent
                after:transition-transform after:duration-500
                hover:after:scale-x-100
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
        releaseYear={value.releaseYear}
        seoImageSrc={seoImageSrc}
        title={value.title}
      />
    </>
  );
}

function Meta({
  className,
  countries,
  releaseYear,
  runtimeMinutes,
}: Pick<Review, "countries" | "releaseYear" | "runtimeMinutes"> & {
  className?: string;
}): React.JSX.Element {
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
      className={`
        text-center font-sans text-sm tracking-wide text-subtle uppercase
        ${className ?? ""}
      `}
    >
      {releaseYear} <span>|</span> {allCountries} <span>|</span>{" "}
      {runtimeMinutes}
      &#x02009;min{" "}
      <span>
        <span>|</span>{" "}
        <a
          className={`
            relative -mb-1 inline-block origin-bottom-left pb-1 text-default
            after:absolute after:bottom-1 after:left-0 after:h-px after:w-full
            after:origin-left after:scale-x-0 after:bg-(--fg-default)/80
            after:transition-transform
            hover:after:scale-x-100
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
}): React.JSX.Element {
  if (!value) {
    return <div className={className} />;
  }

  return <div className={className}>({value})</div>;
}

function ViewingHistory({
  value,
}: Pick<ReviewProps, "value">): React.JSX.Element {
  const viewings: ReviewContent["viewings"] = value.viewings;
  return (
    <aside className="w-full max-w-popout">
      <SubHeading as="h2" className="text-center shadow-bottom">
        Viewing History
      </SubHeading>
      <ul className="bg-default">
        {viewings.map((viewing, index) => (
          <ViewingHistoryListItem key={index} value={viewing} />
        ))}
      </ul>
    </aside>
  );
}
