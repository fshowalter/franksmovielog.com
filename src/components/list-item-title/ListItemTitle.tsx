export function ListItemTitle({
  className = "",
  reviewSlug,
  title,
  year,
}: {
  className?: string;
  reviewSlug?: string;
  title: string;
  year: string;
}): React.JSX.Element {
  const yearBox = (
    <span className={`text-xxs leading-none font-light text-subtle`}>
      {year}
    </span>
  );

  return reviewSlug ? (
    <a
      className={`
        text-base/5 font-semibold text-default transition-all duration-500
        after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
        after:opacity-0
        hover:text-accent
      `}
      href={`/reviews/${reviewSlug}/`}
    >
      {title}
      &#x202F;&#x202F;
      {yearBox}
    </a>
  ) : (
    <span
      className={`
        ${className}
        block text-base/5 font-semibold
        text-(--list-item-title-unreviewed-color,var(--fg-subtle))
      `}
    >
      {title}
      &#x202F;&#x202F;
      {yearBox}
    </span>
  );
}
