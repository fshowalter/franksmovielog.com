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
    <span className={`text-xxs leading-none font-light text-subtle`}>
      {year}
    </span>
  );

  if (slug) {
    return (
      <a
        className={`
          font-sans text-[13px] leading-4 font-medium text-accent
          after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
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
    <span
      className={`
        block font-sans text-[13px] leading-4 font-semibold text-muted
      `}
    >
      {title}
      &#x202F;&#x202F;
      {yearBox}
    </span>
  );
}
