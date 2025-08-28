export function ListItemTitle({
  className = "",
  slug,
  title,
  year,
}: {
  className?: string;
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
          text-base leading-5 font-semibold text-default transition-all
          duration-500
          after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
          after:opacity-0
          hover:text-accent
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
        ${className}
        block text-base leading-5 font-semibold
        text-[var(--list-item-title-unreviewed-color,var(--fg-subtle))]
      `}
    >
      {title}
      &#x202F;&#x202F;
      {yearBox}
    </span>
  );
}
