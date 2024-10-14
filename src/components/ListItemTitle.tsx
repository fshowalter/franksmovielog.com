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
    <span className="text-xxs font-light leading-none text-subtle tablet:text-xs">
      {year}
    </span>
  );

  if (slug) {
    return (
      <a
        className="font-sans text-sm font-medium text-accent decoration-accent decoration-2 underline-offset-4 before:absolute before:left-[var(--container-padding)] before:top-4 before:aspect-poster before:w-list-item-poster before:opacity-15 hover:underline hover:before:opacity-0 tablet:before:left-4 tablet:before:bg-[#fff] desktop:before:left-6"
        href={`/reviews/${slug}/`}
      >
        {title}
        &#x202F;&#x202F;
        {yearBox}
      </a>
    );
  }

  return (
    <span className="block font-sans text-sm font-normal text-muted">
      {title}
      &#x202F;&#x202F;
      {yearBox}
    </span>
  );
}
