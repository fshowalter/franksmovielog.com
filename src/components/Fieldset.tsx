import { ccn } from "src/utils/concatClassNames";

export function Fieldset({
  legend,
  className,
  children,
}: {
  legend: string;
  className?: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <fieldset className={ccn("pb-8 pt-6 text-subtle", className)}>
      <legend className="bg-subtle text-center font-sans-caps text-sm uppercase">
        {legend}
      </legend>
      <div className="tablet::gap-8 flex flex-wrap justify-between gap-6 *:shrink-0 *:grow *:basis-64">
        {children}
      </div>
    </fieldset>
  );
}
