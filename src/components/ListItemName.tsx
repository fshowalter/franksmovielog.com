export function ListItemName({ href, name }: { href: string; name: string }) {
  return (
    <a
      className={`
        leading-normal font-sans text-sm font-semibold text-accent
        after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
        after:opacity-0
      `}
      href={href}
    >
      <div className="leading-normal">{name}</div>
    </a>
  );
}
