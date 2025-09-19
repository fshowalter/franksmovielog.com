import { Distribution } from "./Distribution";

/**
 * Distribution chart component for media type statistics.
 * @param props - Component props
 * @param props.values - Distribution data values
 * @returns Distribution chart for media types or false if no data
 */
export function MediaDistribution({
  values,
}: {
  values: React.ComponentProps<typeof Distribution>["values"];
}): false | React.JSX.Element {
  if (values.length === 0) {
    return false;
  }

  return <Distribution title="Top Media" values={values} />;
}
