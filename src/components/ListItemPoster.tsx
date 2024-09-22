import type { PosterImageProps } from "src/api/posters";

export const ListItemPosterImageConfig = {
  width: 75,
  height: 113,
};

export function ListItemPoster({
  slug,
  title,
  year,
  imageProps,
}: {
  slug?: string | null;
  title: string;
  year: string;
  imageProps: PosterImageProps;
}) {
  if (slug) {
    return (
      <a
        href={`/reviews/${slug}/`}
        className="w-auto min-w-16 max-w-16 shrink-0 tablet:max-w-unset"
      >
        <img
          {...imageProps}
          alt={`A poster from ${title} (${year})`}
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
    <div className="w-auto min-w-16 max-w-16 shrink-0 tablet:max-w-unset">
      <img
        {...imageProps}
        alt="An unreviewed title."
        width={ListItemPosterImageConfig.width}
        height={ListItemPosterImageConfig.height}
        loading="lazy"
        decoding="async"
        className="aspect-[0.66666667]"
      />
    </div>
  );
}
