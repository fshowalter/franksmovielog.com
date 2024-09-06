import type { PosterImageProps } from "src/api/posters";
import type { Review, ReviewWithContent } from "src/api/reviews";
import type { StillImageProps } from "src/api/stills";
import { Still } from "src/components/Still";

import { CastAndCrewChips } from "./CastAndCrewChips";
import { CollectionChips } from "./CollectionChips";
import { Content } from "./Content";
import { Credits } from "./Credits";
import { Header } from "./Header";
import { MoreFromCastAndCrew } from "./MoreFromCastAndCrew";
import { MoreInCollections } from "./MoreInCollections";
import { MoreReviews } from "./MoreReviews";
import { StructuredData } from "./StructuredData";
import { ViewingHistoryListItem } from "./ViewingHistoryListItem";

export const StillImageConfig = {
  width: 960,
  height: 540,
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
      className="flex scroll-mt-[var(--header-offset)] flex-col items-center"
    >
      <Header
        title={value.title}
        year={value.year}
        originalTitle={value.originalTitle}
        countries={value.countries}
        runtimeMinutes={value.runtimeMinutes}
        className="px-pageMargin py-6 text-center desktop:py-8"
      />
      <Still
        title={value.title}
        year={value.year}
        width={StillImageConfig.width}
        height={StillImageConfig.height}
        sizes={StillImageConfig.sizes}
        className="mb-[5.33px]"
        imageProps={stillImageProps}
        loading="eager"
        decoding="sync"
      />
      <div className="h-6 min-h-6 tablet:h-8 tablet:min-h-8" />
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
      <div className="spacer-y-32" />
      <div
        data-pagefind-ignore
        className="flex w-full max-w-popout flex-col items-center gap-y-12 bg-default tablet:max-w-full tablet:bg-subtle tablet:pb-32 tablet:pt-8 desktop:gap-y-24"
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
