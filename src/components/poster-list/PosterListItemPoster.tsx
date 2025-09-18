import type { PosterImageProps } from "~/api/posters";

/**
 * Poster image component for list items.
 * @param props - Component props
 * @param props.imageConfig - Image sizing configuration
 * @param props.imageProps - Poster image properties
 * @returns Poster element with hover effects
 */
export function PosterListItemPoster({
  imageConfig,
  imageProps,
}: {
  imageConfig: {
    height: number;
    sizes: string;
    width: number;
  };
  imageProps: PosterImageProps;
}): React.JSX.Element {
  return (
    <div
      className={`
        relative w-1/4 max-w-[250px] shrink-0 self-start overflow-hidden
        rounded-sm shadow-all
        after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
        after:bg-default after:opacity-15 after:transition-all
        after:duration-500
        group-has-[a:hover]/list-item:after:opacity-0
        tablet:w-full
      `}
    >
      <img
        {...imageProps}
        alt=""
        {...imageConfig}
        className={`
          aspect-poster w-full transform-gpu object-cover transition-transform
          duration-500
          group-has-[a:hover]/list-item:scale-110
        `}
        decoding="async"
        loading="lazy"
      />
    </div>
  );
}
