import { capitalize } from "src/utils/capitalize";

export function CreditedAs({
  values,
}: {
  values: readonly string[];
}): JSX.Element | null {
  return (
    <div className="font-sans text-sm leading-4 tracking-0.5px text-subtle">
      {values.map((value, index) => {
        if (index === 0) {
          return <span key={value}>{capitalize(value)}</span>;
        }

        return <span key={value}> | {capitalize(value)}</span>;
      })}
    </div>
  );
}
