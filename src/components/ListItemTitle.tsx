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
    <span className="text-xxs font-light text-subtle tablet:text-xs">
      {year}
    </span>
  );

  if (slug) {
    return (
      <a
        href={`/reviews/${slug}/`}
        className="block font-sans text-sm font-medium text-accent decoration-accent decoration-2 underline-offset-4 before:absolute before:left-[var(--container-padding)] before:top-4 before:aspect-poster before:w-list-item-poster hover:underline tablet:before:left-4 desktop:before:left-6"
      >
        {title}
        {"\u202F"}
        {"\u202F"}
        {yearBox}
      </a>
    );
  }

  return (
    <span className="block font-sans text-sm font-normal text-muted">
      {title}
      {"\u202F"}
      {"\u202F"}
      {yearBox}
    </span>
  );
}
