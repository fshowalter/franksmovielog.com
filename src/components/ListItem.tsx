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
        "flex max-w-screen-max flex-row gap-x-4 px-[8%] py-4 odd:bg-default tablet:gap-x-6 tablet:px-12 desktop:gap-x-16 desktop:px-20",
        className,
      )}
    >
      {children}
    </li>
  );
}
