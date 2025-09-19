import { capitalize } from "~/utils/capitalize";
/**
 * Displays credited roles (e.g., "Director, Writer") in a list item.
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @param props.values - Array of credit roles to display
 * @returns Comma-separated list of capitalized credit roles
 */
export function ListItemCreditedAs({
  className = "",
  values,
}: {
  className?: string;
  values: readonly string[];
}): React.JSX.Element {
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
