import type { JSX } from "react";

import type { PosterImageProps } from "~/api/posters";

import { Button } from "./Button";
import { GroupingListItem } from "./GroupingListItem";

export const PosterListItemImageConfig = {
  height: 375,
  sizes:
    "(min-width: 1800px) 216px, (min-width: 1380px) calc(13.25vw - 20px), (min-width: 1280px) calc(20vw - 70px), (min-width: 1060px) calc(20vw - 57px), (min-width: 800px) calc(25vw - 60px), (min-width: 680px) calc(33vw - 61px), calc(23.06vw + 4px)",
  width: 250,
};

export function GroupedPosterList<T>({
  children,
  groupedValues,
  groupItemClassName,
  onShowMore,
  totalCount,
  visibleCount,
  ...rest
}: {
  children: (item: T) => React.ReactNode;
  groupedValues: Map<string, Iterable<T>>;
  groupItemClassName?: string;
  onShowMore?: () => void;
  totalCount: number;
  visibleCount: number;
}): JSX.Element {
  return (
    <>
      <ol data-testid="grouped-poster-list" {...rest}>
        {[...groupedValues].map((groupedValue) => {
          const [group, groupValues] = groupedValue;
          return (
            <GroupingListItem
              className={groupItemClassName}
              groupText={group}
              key={group}
            >
              {" "}
              <div className="tablet:-mx-6">
                <PosterList>
                  {[...groupValues].map((value) => children(value))}
                </PosterList>
              </div>
            </GroupingListItem>
          );
        })}
      </ol>
      {onShowMore && (
        <div className="flex flex-col items-center px-container py-10">
          {totalCount > visibleCount && (
            <Button onClick={onShowMore}>Show More</Button>
          )}
        </div>
      )}
    </>
  );
}

export function PosterList({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="@container/poster-list">
      <ol
        className={`
          [--poster-list-item-width:50%]
          tablet:flex tablet:flex-wrap
          @min-[calc((250px_*_2)_+_1px)]/poster-list:[--poster-list-item-width:33.33%]
          @min-[calc((250px_*_3)_+_1px)]/poster-list:[--poster-list-item-width:25%]
          @min-[calc((250px_*_4)_+_1px)]/poster-list:[--poster-list-item-width:20%]
          @min-[calc((250px_*_5)_+_1px)]/poster-list:[--poster-list-item-width:16.66%]
          ${className}
        `}
      >
        {children}
      </ol>
    </div>
  );
}

export function PosterListItem({
  children,
  className,
  posterImageProps,
}: {
  children: React.ReactNode;
  className?: string;
  posterImageProps: PosterImageProps;
}) {
  return (
    <li
      className={`
        group/list-item relative mb-1 flex w-full max-w-(--breakpoint-desktop)
        transform-gpu flex-row gap-x-[5%] bg-default px-container py-4
        transition-transform
        tablet:w-(--poster-list-item-width) tablet:flex-col
        tablet:bg-transparent tablet:px-6 tablet:py-6
        tablet:has-[a:hover]:-translate-y-2 tablet:has-[a:hover]:bg-default
        tablet:has-[a:hover]:drop-shadow-2xl
        ${className ?? ""}
      `}
    >
      <PosterListItemPoster imageProps={posterImageProps} />
      {children}
    </li>
  );
}

function PosterListItemPoster({
  imageProps,
}: {
  imageProps: PosterImageProps;
}) {
  return (
    <div
      className={`
        relative w-1/4 max-w-[250px] shrink-0 transition-transform
        after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
        after:bg-default after:opacity-15 after:transition-opacity
        group-has-[a:hover]/list-item:after:opacity-0
        tablet:w-auto
      `}
    >
      <img
        {...imageProps}
        alt=""
        {...PosterListItemImageConfig}
        className="aspect-poster w-full object-cover"
        decoding="async"
        loading="lazy"
      />
    </div>
  );
}
