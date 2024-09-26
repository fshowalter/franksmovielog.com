import type { PosterImageProps } from "src/api/posters";

export const ListItemPosterImageConfig = {
  width: 80,
  height: 113,
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
