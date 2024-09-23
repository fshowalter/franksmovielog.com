import type { PosterImageProps } from "src/api/posters";

export const ListItemPosterImageConfig = {
  width: 80,
  height: 113,
};

export function ListItemPoster({
  slug,
  imageProps,
}: {
  slug?: string | null;
  imageProps: PosterImageProps;
}) {
  if (slug) {
    return (
      <a
        href={`/reviews/${slug}/`}
        className="w-16 shrink-0 tablet:w-[76px] desktop:w-20"
      >
        <img
          {...imageProps}
          alt=""
          width={ListItemPosterImageConfig.width}
          height={ListItemPosterImageConfig.height}
          loading="lazy"
          decoding="async"
          className="aspect-[0.66666667]"
        />
      </a>
    );
  }

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
