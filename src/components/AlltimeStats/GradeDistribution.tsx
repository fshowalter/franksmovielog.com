import type { AlltimeStats } from "src/api/alltimeStats";
import { Distribution } from "src/components/Distribution";

export function GradeDistribution({
  values,
}: {
  values: Pick<AlltimeStats["gradeDistribution"][0], "name" | "count">[];
}): JSX.Element | null {
  return <Distribution values={values} title="Grade Distribution" />;
}
