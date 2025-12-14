import type { StillImageProps } from "~/api/stills";

import { ListItemWatchlistReason } from "~/components/list-item-watchlist-reason/ListItemWatchlistReason";
import { CardEyebrow } from "~/components/review-card/CardEyebrow";
import { CardFooter } from "~/components/review-card/CardFooter";
import { CardMobilePadding } from "~/components/review-card/CardMobilePadding";
import { CardTitle } from "~/components/review-card/CardTitle";
import { Still } from "~/components/still/Still";

/**
 * Data structure for review card content.
 */
export type PlaceholderCardValue = {
  creditedAs: string[];
  genres: readonly string[];
  imdbId: string;
  releaseYear: string;
  stillImageProps: StillImageProps;
  title: string;
  watchlistCollectionNames: string[];
  watchlistDirectorNames: string[];
  watchlistPerformerNames: string[];
  watchlistWriterNames: string[];
};

/**
 * Card component displaying a movie review placeholder.
 * @param props - Component props
 * @param props.as - The element type to render (defaults to "div")
 * @param props.imageConfig - Image sizing configuration
 * @param props.value - Placeholder data to display
 * @returns Review card with still image, title, grade, and excerpt
 */
export function PlaceholderCard({
  as = "div",
  imageConfig,
  value,
}: {
  as?: React.ElementType;
  imageConfig: {
    height: number;
    sizes: string;
    width: number;
  };
  value: PlaceholderCardValue;
}): React.JSX.Element {
  const Component = as;

  return (
    <Component
      className={`
        group/card relative mb-1 w-(--review-card-width,100%) self-start
        bg-default/50
        tablet:mb-0
      `}
    >
      <CardMobilePadding>
        <div className={`relative mb-6 block overflow-hidden`}>
          <Still
            imageProps={value.stillImageProps}
            {...imageConfig}
            className={`
              h-auto w-full transform-gpu transition-transform duration-500
              group-has-[a:hover]/card:scale-110
            `}
            decoding="async"
            loading="lazy"
          />
        </div>
        <div
          className={`
            flex grow flex-col px-1 pb-8
            tablet:px-[8%]
            laptop:pr-[10%] laptop:pl-[8.5%]
          `}
        >
          <CardEyebrow>{value.creditedAs.join(", ")}</CardEyebrow>
          <CardTitle releaseYear={value.releaseYear} title={value.title} />
          <div className="mt-1 mb-9">
            <ListItemWatchlistReason
              collectionNames={value.watchlistCollectionNames}
              directorNames={value.watchlistDirectorNames}
              performerNames={value.watchlistPerformerNames}
              writerNames={value.watchlistWriterNames}
            />
          </div>
          <CardFooter>{value.genres.join(", ")}</CardFooter>
        </div>
      </CardMobilePadding>
    </Component>
  );
}
