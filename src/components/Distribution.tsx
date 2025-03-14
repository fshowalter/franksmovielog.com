import { BarGradient } from "./BarGradient";

type Value = {
  count: number;
  name: string;
};

export function Distribution({
  title,
  values,
}: {
  title: string;
  values: readonly Value[];
}) {
  const maxBar = values.reduce((total, value) => total + value.count, 0);

  return (
    <section className="w-full bg-default px-container pb-8">
      <h2 className="py-4 text-xl font-medium">{title}</h2>
      <div className="grid w-full grid-cols-[1fr,auto] tablet:whitespace-nowrap">
        {values.map((value) => {
          return (
            <div
              className="col-span-2 grid grid-cols-subgrid py-3"
              key={value.name}
            >
              <div className="col-span-2 grid grid-cols-subgrid">
                <div className="pr-3 font-sans text-xs text-muted">
                  {value.name}
                </div>
                <div className="col-start-2 self-center text-nowrap pb-1 text-right font-sans text-xs text-subtle">
                  {value.count}
                </div>
              </div>
              <div className="col-span-2 row-start-2 bg-subtle">
                <BarGradient maxValue={maxBar} value={value.count} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
