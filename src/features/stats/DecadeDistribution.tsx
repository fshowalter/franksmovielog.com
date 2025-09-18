import { Distribution } from "./Distribution";

/**
 * Distribution chart component for decade-based statistics.
 * @param props - Component props
 * @param props.values - Distribution data values
 * @returns Distribution chart for decades
 */
export function DecadeDistribution({
  values,
}: {
  values: React.ComponentProps<typeof Distribution>["values"];
}): React.JSX.Element {
  return <Distribution title="By Release Year" values={values} />;
}
