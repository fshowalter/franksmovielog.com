import type { PosterImageProps } from "~/api/posters";

import { PosterListItemPoster } from "./PosterListItemPoster";

export const PosterListItemImageConfig = {
  height: 375,
  sizes:
    "(min-width: 1800px) 216px, (min-width: 1380px) calc(13.25vw - 20px), (min-width: 1280px) calc(20vw - 70px), (min-width: 1060px) calc(20vw - 57px), (min-width: 800px) calc(25vw - 60px), (min-width: 680px) calc(33vw - 61px), calc(23.06vw + 4px)",
  width: 250,
};

export function PosterListItem({
  children,
  hasReview = true,
  posterImageProps,
}: {
  bgClasses?: string;
  children: React.ReactNode;
  className?: string;
  hasReview?: boolean;
  posterImageProps: PosterImageProps;
}): React.JSX.Element {
  return (
    <li
      className={`
        group/list-item relative mb-1 flex w-full max-w-(--breakpoint-desktop)
        transform-gpu flex-row gap-x-[5%] px-container py-4 transition-transform
        duration-500
        tablet:w-(--poster-list-item-width) tablet:flex-col
        tablet:bg-transparent tablet:px-6 tablet:py-6
        ${
          hasReview
            ? `
              bg-default
              tablet:has-[a:hover]:-translate-y-2
              tablet:has-[a:hover]:bg-default
              tablet:has-[a:hover]:drop-shadow-2xl
            `
            : `bg-transparent`
        }
      `}
    >
      <PosterListItemPoster
        imageConfig={PosterListItemImageConfig}
        imageProps={posterImageProps}
      />
      {children}
    </li>
  );
}
