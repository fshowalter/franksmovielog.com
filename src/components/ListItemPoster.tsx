import type { PosterImageProps } from "src/api/posters";

export const ListItemPosterImageConfig = {
  height: 113,
  sizes: "(max-width: 767px) 64px, (max-width: 1279px) 76px, 80px",
  width: 80,
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
        {...ListItemPosterImageConfig}
        className="aspect-poster"
        decoding="async"
        loading="lazy"
      />
    </div>
  );
}
