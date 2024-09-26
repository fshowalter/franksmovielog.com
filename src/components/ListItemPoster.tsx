import type { PosterImageProps } from "src/api/posters";

export const ListItemPosterImageConfig = {
  width: 80,
  height: 113,
  sizes: "(max-width: 767px) 64px, (max-width: 1279px) 76px, 80px",
};

export function ListItemPoster({
  imageProps,
}: {
  imageProps: PosterImageProps;
}) {
  return (
    <div className="w-list-item-poster shrink-0">
      <img
        {...imageProps}
        alt=""
        width={ListItemPosterImageConfig.width}
        height={ListItemPosterImageConfig.height}
        loading="lazy"
        decoding="async"
        className="aspect-poster"
      />
    </div>
  );
}
