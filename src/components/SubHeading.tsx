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
        "py-10 font-sans-bold text-xs uppercase tracking-[0.8px] text-subtle",
        className,
      )}
    >
      {children}
    </Component>
  );
}
