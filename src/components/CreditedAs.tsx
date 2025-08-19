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
        font-sans text-xs leading-4 font-medium text-muted
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
