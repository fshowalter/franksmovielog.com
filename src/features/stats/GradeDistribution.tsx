import type { AlltimeStats } from "~/api/stats";

import { Distribution } from "./Distribution";

/**
 * Distribution chart component for grade statistics.
 * @param props - Component props
 * @param props.values - Grade distribution data values
 * @returns Distribution chart for grades
 */
export function GradeDistribution({
  values,
}: {
  values: Pick<AlltimeStats["gradeDistribution"][number], "count" | "name">[];
}): React.JSX.Element {
  return <Distribution title="Grade Distribution" values={values} />;
}
