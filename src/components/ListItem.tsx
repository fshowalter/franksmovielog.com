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
        "relative mb-px flex max-w-screen-max flex-row gap-x-4 px-[8%] py-4 shadow-bottom even:bg-subtle tablet:gap-x-6 tablet:px-1",
        className,
      )}
    >
      {children}
    </li>
  );
}
