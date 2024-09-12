import type { PosterImageProps } from "src/api/posters";

export const ListItemPosterImageConfig = {
  width: 56,
  height: 84,
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
        className="min-w-14 max-w-14 shrink-0 overflow-hidden"
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
    <div className="safari-border-radius-fix min-w-14 max-w-14 shrink-0 overflow-hidden rounded-lg shadow-all">
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
