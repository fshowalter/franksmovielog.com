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
    <div className="w-16 shrink-0 tablet:w-[76px] desktop:w-20">
      <img
        {...imageProps}
        alt=""
        width={ListItemPosterImageConfig.width}
        height={ListItemPosterImageConfig.height}
        loading="lazy"
        decoding="async"
        className="aspect-[0.66666667]"
      />
    </div>
  );
}
