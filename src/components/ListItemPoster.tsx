import type { PosterImageProps } from "~/api/posters";

export const ListItemPosterImageConfig = {
  height: 375,
  // sizes: "(max-width: 767px) 64px, (max-width: 1279px) 76px, 80px",
  width: 250,
};

export function ListItemPoster({
  imageProps,
}: {
  imageProps: PosterImageProps;
}) {
  return (
    <div
      className={`
        relative w-1/4 max-w-[250px] transition-transform
        after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
        after:bg-default after:opacity-15 after:transition-opacity
        group-has-[a:hover]/list-item:after:opacity-0
        tablet:w-auto
      `}
    >
      <img
        {...imageProps}
        alt=""
        {...ListItemPosterImageConfig}
        className="aspect-poster w-full object-cover"
        decoding="async"
        loading="lazy"
      />
    </div>
  );
}
