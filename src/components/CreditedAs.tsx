import { capitalize } from "~/utils/capitalize";

export function CreditedAs({
  className = "",
  values,
}: {
  className?: string;
  values: readonly string[];
}) {
  return (
    <div
      className={`
        text-sm leading-5 font-normal tracking-prose text-muted
        ${className}
      `}
    >
      {values.map((value, index) => {
        if (index === 0) {
          return `${capitalize(value)}`;
        }

        return `, ${capitalize(value)}`;
      })}
    </div>
  );
}
