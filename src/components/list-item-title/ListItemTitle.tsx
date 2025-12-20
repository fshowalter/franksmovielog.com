/**
 * Renders a movie title with year, optionally as a link to the review.
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @param props.slug - URL slug for linking to the review (if reviewed)
 * @param props.title - The movie title
 * @param props.year - The movie release year
 * @returns Title with year, linked if slug is provided
 */
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
}): React.JSX.Element {
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
        text-(--list-item-title-unreviewed-color,var(--fg-subtle))
      `}
    >
      {title}
      &#x202F;&#x202F;
      {yearBox}
    </span>
  );
}
