export function ListItem({
  background = "bg-default",
  children,
  className,
  extraVerticalPadding = false,
  itemsCenter = false,
}: {
  background?: string;
  children: React.ReactNode;
  className?: string;
  extraVerticalPadding?: boolean;
  itemsCenter?: boolean;
}) {
  return (
    <li
      className={`
        ${background ?? ""}
        ${itemsCenter ? "items-center" : ""}
        ${extraVerticalPadding ? `tablet:py-6` : ""}
        group/list-item relative mb-1 flex max-w-(--breakpoint-desktop)
        transform-gpu flex-row gap-x-4 px-container py-4 transition-transform
        tablet:gap-x-6 tablet:px-4
        tablet-landscape:has-[a:hover]:z-hover
        tablet-landscape:has-[a:hover]:scale-[102.5%]
        tablet-landscape:has-[a:hover]:shadow-all
        tablet-landscape:has-[a:hover]:drop-shadow-2xl
        laptop:px-6
        ${className ?? ""}
      `}
    >
      {children}
    </li>
  );
}
