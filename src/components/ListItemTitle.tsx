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
    <span className="text-xs font-normal text-subtle tablet:text-sm">
      {year}
    </span>
  );

  if (slug) {
    return (
      <a
        href={`/reviews/${slug}/`}
        className="block font-sans-narrow text-sm font-bold text-accent decoration-accent decoration-2 underline-offset-4 hover:underline tablet:text-base"
      >
        {title}&#8239;&#8239;{yearBox}
      </a>
    );
  }

  return (
    <span className="block font-sans-narrow text-sm font-semibold text-muted tablet:text-base">
      {title}&#8239;&#8239;{yearBox}
    </span>
  );
}
