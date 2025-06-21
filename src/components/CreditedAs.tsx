import { capitalize } from "~/utils/capitalize";

export function CreditedAs({ values }: { values: readonly string[] }) {
  return (
    <div className="font-sans text-xs leading-4 font-light text-subtle">
      {values.map((value, index) => {
        if (index === 0) {
          return `${capitalize(value)}`;
        }

        return ` | ${capitalize(value)}`;
      })}
    </div>
  );
}
