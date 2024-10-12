export function ListItemTitle({
  slug,
  title,
  year,
}: {
  slug?: string;
  title: string;
  year: string;
}) {
  const yearBox = (
    <span className="text-xxs font-light text-subtle tablet:text-xs">
      {year}
    </span>
  );

  if (slug) {
    return (
      <a
        className="block font-sans text-sm font-medium text-accent decoration-accent decoration-2 underline-offset-4 before:absolute before:left-[var(--container-padding)] before:top-4 before:aspect-poster before:w-list-item-poster before:opacity-15 hover:underline hover:before:opacity-0 tablet:before:left-4 tablet:before:bg-[#fff] desktop:before:left-6"
        href={`/reviews/${slug}/`}
      >
        {title}
        &#8239;&#8239;
        {yearBox}
      </a>
    );
  }

  return (
    <span className="block font-sans text-sm font-normal text-muted">
      {title}
      &#8239;&#8239;
      {yearBox}
    </span>
  );
}
