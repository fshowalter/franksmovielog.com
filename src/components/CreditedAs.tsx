import { capitalize } from "~/utils/capitalize";

export function CreditedAs({ values }: { values: readonly string[] }) {
  return (
    <div className="font-sans text-xs font-light leading-4 text-subtle">
      {values.map((value, index) => {
        if (index === 0) {
          return `${capitalize(value)}`;
        }

        return ` | ${capitalize(value)}`;
      })}
    </div>
  );
}
