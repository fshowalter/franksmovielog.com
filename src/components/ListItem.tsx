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
        mb-1 flex max-w-(--breakpoint-desktop) flex-row gap-x-4 px-container
        py-4
        tablet:gap-x-6 tablet:px-4
        laptop:px-6
        ${className ?? ""}
      `}
    >
      {children}
    </li>
  );
}
