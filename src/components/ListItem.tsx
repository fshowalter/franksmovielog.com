import { ccn } from "src/utils/concatClassNames";

export function ListItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <li
      className={ccn(
        "flex max-w-screen-max flex-row gap-x-4 px-[8%] py-4 even:bg-subtle tablet:gap-x-6 tablet:px-0 desktop:gap-x-16",
        className,
      )}
    >
      {children}
    </li>
  );
}
