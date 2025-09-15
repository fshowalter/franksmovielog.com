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
