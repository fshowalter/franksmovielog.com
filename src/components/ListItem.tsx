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
        "relative mb-1 flex max-w-screen-max flex-row gap-x-4 bg-default px-container-base py-4 tablet:gap-x-6 tablet:px-4 desktop:px-6",
        className,
      )}
    >
      {children}
    </li>
  );
}
