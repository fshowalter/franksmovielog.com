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
    <span
      className={`
        text-xxs leading-none font-light text-subtle
        tablet:text-xs
      `}
    >
      {year}
    </span>
  );

  if (slug) {
    return (
      <a
        className={`
          font-sans text-sm font-medium text-accent
          after:absolute after:top-0 after:left-0 after:z-10 after:size-full
          after:opacity-0
        `}
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
