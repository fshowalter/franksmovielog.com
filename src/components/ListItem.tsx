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
        "relative mb-px flex max-w-screen-max flex-row gap-x-4 px-container-base py-4 even:bg-subtle tablet:gap-x-6 tablet:px-4",
        className,
      )}
    >
      {children}
    </li>
  );
}
