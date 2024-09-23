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
        className="block font-sans-narrow text-sm font-semibold text-accent decoration-accent decoration-2 underline-offset-4 before:absolute before:left-[var(--container-padding)] before:top-4 before:aspect-[0.66666667] before:w-16 hover:underline tablet:text-base tablet:before:left-4 tablet:before:w-[76px] desktop:before:left-6 desktop:before:w-20"
      >
        {title}&#8239;&#8239;{yearBox}
      </a>
    );
  }

  return (
    <span className="block font-sans-narrow text-sm font-medium text-muted tablet:text-base">
      {title}&#8239;&#8239;{yearBox}
    </span>
  );
}
