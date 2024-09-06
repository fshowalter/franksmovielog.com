import { ccn } from "src/utils/concatClassNames";

export function PageTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <h1
      data-pagefind-meta="title"
      className={ccn(
        "text-[2rem] font-bold leading-none desktop:text-[3rem]",
        className,
      )}
    >
      {children}
    </h1>
  );
}
