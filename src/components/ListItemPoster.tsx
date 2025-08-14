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
    <div className={`relative mb-2 max-w-[250px]`}>
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
