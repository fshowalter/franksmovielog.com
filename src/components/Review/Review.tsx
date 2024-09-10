import type { PosterImageProps } from "src/api/posters";
import type { Review, ReviewWithContent } from "src/api/reviews";
import type { StillImageProps } from "src/api/stills";
import { Still } from "src/components/Still";

import { Grade } from "../Grade";
import { CastAndCrewChips } from "./CastAndCrewChips";
import { CollectionChips } from "./CollectionChips";
import { Content } from "./Content";
import { Credits } from "./Credits";
import { MoreFromCastAndCrew } from "./MoreFromCastAndCrew";
import { MoreInCollections } from "./MoreInCollections";
import { MoreReviews } from "./MoreReviews";
import { StructuredData } from "./StructuredData";
import { ViewingHistoryListItem } from "./ViewingHistoryListItem";

export const StillImageConfig = {
  width: 1536,
  height: 864,
  sizes: "(min-width: 960px) 960px, 100vw",
};

export interface Props {
  value: ReviewWithContent;
  stillImageProps: StillImageProps;
  posterImageProps: PosterImageProps;
  moreFromCastAndCrew: React.ComponentProps<
    typeof MoreFromCastAndCrew
  >["values"];
  moreInCollections: React.ComponentProps<typeof MoreInCollections>["values"];
  moreReviews: React.ComponentProps<typeof MoreReviews>["values"];
  castAndCrewChips: React.ComponentProps<typeof CastAndCrewChips>["values"];
  collectionChips: React.ComponentProps<typeof CollectionChips>["values"];
  seoImageSrc: string;
}

export function Review({
  value,
  stillImageProps,
  posterImageProps,
  collectionChips,
  seoImageSrc,
  moreFromCastAndCrew,
  moreInCollections,
  moreReviews,
  castAndCrewChips,
}: Props): JSX.Element {
  return (
    <main
      id="top"
      data-pagefind-body
      className="flex scroll-mt-[var(--header-offset)] flex-col"
    >
      <header className="flex flex-col items-center pt-10">
        <h1 data-pagefind-meta="title" className="text-7xl">
          {value.title}
        </h1>
        <OriginalTitle value={value.originalTitle} />
        <div className="spacer-y-4" />
        <Grade value={value.grade} height={32} />
        <div className="spacer-y-4" />
        <Meta
          year={value.year}
          countries={value.countries}
          runtimeMinutes={value.runtimeMinutes}
        />
        <div className="spacer-y-12" />
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
      <div className="spacer-y-20" />
      <div className="flex flex-col items-center">
        <Content
          grade={value.grade}
          date={value.date}
          content={value.content}
          className="items-center px-pageMargin"
        />
        <div className="spacer-y-20" />
        <div className="w-full max-w-popout">
          <h3 className="px-gutter text-lg font-semibold text-subtle shadow-bottom">
            Viewing History
            <div className="spacer-y-2" />
          </h3>
          <ul>
            {value.viewings.map((viewing) => (
              <ViewingHistoryListItem key={viewing.sequence} value={viewing} />
            ))}
          </ul>
        </div>
        <div className="spacer-y-32" />
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
        >
          <ul className="flex flex-wrap gap-2">
            <CastAndCrewChips values={castAndCrewChips} />
            <CollectionChips values={collectionChips} />
          </ul>
        </Credits>
      </div>
      <div className="spacer-y-32" />
      <div
        data-pagefind-ignore
        className="flex w-full flex-col items-center gap-y-12 bg-default tablet:max-w-full tablet:bg-subtle tablet:pb-32 tablet:pt-8 desktop:gap-y-24"
      >
        <MoreFromCastAndCrew values={moreFromCastAndCrew} />
        <MoreInCollections values={moreInCollections} />
        <MoreReviews values={moreReviews} />
      </div>
      <div className="spacer-y-32 tablet:spacer-y-0" />
      <StructuredData
        title={value.title}
        year={value.year}
        directorNames={value.directorNames}
        imdbId={value.imdbId}
        grade={value.grade}
        seoImageSrc={seoImageSrc}
      />
    </main>
  );
}

function OriginalTitle({ value }: { value: string | null }) {
  if (!value) {
    return null;
  }

  return <div className="text-muted">({value})</div>;
}

function Meta({
  year,
  countries,
  runtimeMinutes,
}: Pick<ReviewWithContent, "year" | "countries" | "runtimeMinutes">) {
  return (
    <div className="font-sans-caps text-xs uppercase tracking-[1.1px] text-subtle">
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
