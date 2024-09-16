export function ListItemTitle({
  title,
  year,
  slug,
}: {
  title: string;
  year: string;
  slug?: string | null;
}) {
  const yearBox = (
    <span className="text-xs text-subtle tablet:text-sm">{year}</span>
  );

  if (slug) {
    return (
      <a
        href={`/reviews/${slug}/`}
        className="block font-sans-bold text-sm text-accent tablet:text-base"
      >
        {title}&#8239;&#8239;{yearBox}
      </a>
    );
  }

  return (
    <span className="block font-sans text-sm text-muted tablet:text-base">
      {title}&#8239;&#8239;{yearBox}
    </span>
  );
}
