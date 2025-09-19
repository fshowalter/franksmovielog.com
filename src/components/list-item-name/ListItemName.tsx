/**
 * Renders a linked name for use in list items.
 * @param props - Component props
 * @param props.href - Link destination URL
 * @param props.name - The display name text
 * @returns Styled anchor element with name
 */
export function ListItemName({
  href,
  name,
}: {
  href: string;
  name: string;
}): React.JSX.Element {
  return (
    <a
      className={`
        leading-normal text-base font-semibold text-default transition-all
        duration-500
        after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
        after:opacity-0
        hover:text-accent
      `}
      href={href}
    >
      <div className="leading-normal">{name}</div>
    </a>
  );
}
