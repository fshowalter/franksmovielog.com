import type { StillImageProps } from "~/api/stills";

import { Still } from "~/components/still/Still";

/**
 * Card component displaying a movie still image.
 * @param props - Component props
 * @param props.imageProps - The image properties
 * @param props.imageConfig - Image sizing configuration
 * @returns Review card still image
 */
export function CardStill({
  imageConfig,
  imageProps,
}: {
  imageConfig: {
    height: number;
    sizes: string;
    width: number;
  };
  imageProps: StillImageProps;
}): React.JSX.Element {
  return (
    <div
      className={`
        relative mb-6 block overflow-hidden
        after:absolute after:top-0 after:left-0 after:aspect-video
        after:size-full after:bg-default after:opacity-(--still-opacity,15%)
        after:duration-500
        group-has-[a:hover]/card:after:opacity-0
        tablet:after:inset-x-0 tablet:after:top-0
      `}
    >
      <Still
        imageProps={imageProps}
        {...imageConfig}
        className={`
          h-auto w-full transform-gpu transition-transform duration-500
          group-has-[a:hover]/card:scale-110
        `}
        decoding="async"
        loading="lazy"
      />
    </div>
  );
}
