import type { ElementType } from "react";

export function LabelText({
  value,
  htmlFor,
  as = "span",
}: {
  value: string;
  htmlFor?: string;
  as?: ElementType;
}) {
  const Component = as;

  return (
    <Component
      className="inline-block h-6 text-left font-sans text-xs uppercase leading-none tracking-[0.8px] text-subtle"
      htmlFor={htmlFor}
    >
      {value}
    </Component>
  );
}
