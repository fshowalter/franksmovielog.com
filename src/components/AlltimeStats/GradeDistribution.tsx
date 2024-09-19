import type { AlltimeStats } from "src/api/alltimeStats";
import { BarGradient } from "src/components/BarGradient";

export function GradeDistribution({
  values,
}: {
  values: Pick<AlltimeStats["gradeDistribution"][0], "name" | "count">[];
}): JSX.Element | null {
  const maxBar = values.reduce((acc, value) => {
    return (acc += value.count);
  }, 0);

  return (
    <section className="w-full bg-default px-container pb-8">
      <h2 className="py-4 font-serif-semibold desktop:text-xl">
        Grade Distribution
      </h2>
      <div className="grid w-full grid-cols-[1fr,auto] tablet:whitespace-nowrap">
        {values.map((value) => {
          return (
            <div
              key={value.name}
              className="col-span-2 grid grid-cols-subgrid py-3"
            >
              <div className="col-span-2 grid grid-cols-subgrid">
                <div className="font-sans-narrow text-sm text-muted">
                  {value.name}
                </div>
                <div className="col-start-2 self-center text-nowrap pb-1 text-right font-sans-narrow text-sm text-subtle tablet:text-sm">
                  {value.count}
                </div>
              </div>
              <div className="col-span-2 row-start-2 bg-subtle">
                <BarGradient value={value.count} maxValue={maxBar} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
