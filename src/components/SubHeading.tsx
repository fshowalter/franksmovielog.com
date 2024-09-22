import { ccn } from "src/utils/concatClassNames";

export function SubHeading({
  children,
  as,
  className,
}: {
  children: React.ReactNode;
  as: "h2" | "h3" | "h4" | "h5";
  className?: string;
}) {
  const Component = as;

  return (
    <Component
      className={ccn(
        "py-10 font-sans text-xs font-bold uppercase tracking-[1.2px] text-subtle",
        className,
      )}
    >
      {children}
    </Component>
  );
}
