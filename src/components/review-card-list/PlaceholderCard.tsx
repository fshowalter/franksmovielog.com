import type { StillImageProps } from "~/api/stills";

import { ListItemWatchlistReason } from "~/components/list-item-watchlist-reason/ListItemWatchlistReason";
import { Still } from "~/components/still/Still";

/**
 * Data structure for review card content.
 */
export type PlaceholderCardValue = {
  creditedAs: string;
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
        group/card relative mb-1 flex w-(--review-card-width) transform-gpu
        flex-col self-start bg-default/50 px-[8%] pt-12 transition-transform
        duration-500
        tablet:mb-0 tablet:px-0 tablet:pt-0
      `}
    >
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
        <div
          className={`
            mb-3 font-sans text-xs leading-4 font-normal tracking-wider
            text-subtle uppercase
            laptop:tracking-wide
          `}
        >
          {value.creditedAs}
        </div>
        <div
          className={`
            mb-3 block text-2.5xl leading-7 font-medium text-subtle
            tablet:text-2xl
            laptop:text-2.5xl
          `}
        >
          {value.title}&nbsp;
          <span className="text-sm leading-none font-normal text-muted">
            {value.releaseYear}
          </span>
        </div>
        <ListItemWatchlistReason
          collectionNames={value.watchlistCollectionNames}
          directorNames={value.watchlistDirectorNames}
          performerNames={value.watchlistPerformerNames}
          writerNames={value.watchlistWriterNames}
        />
        <div
          className={`
            mt-6 font-sans text-xs leading-4 tracking-wider text-subtle
            laptop:tracking-wide
          `}
        >
          {value.genres.map((genre, index) => {
            if (index === 0) {
              return <span key={genre}>{genre}</span>;
            }

            return <span key={genre}>, {genre}</span>;
          })}
        </div>
      </div>
    </Component>
  );
}
