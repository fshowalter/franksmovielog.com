import type { AlltimeStats } from "src/api/alltimeStats";

import { Distribution } from "src/components/Distribution";

export function GradeDistribution({
  values,
}: {
  values: Pick<AlltimeStats["gradeDistribution"][0], "count" | "name">[];
}): JSX.Element | null {
  return <Distribution title="Grade Distribution" values={values} />;
}
