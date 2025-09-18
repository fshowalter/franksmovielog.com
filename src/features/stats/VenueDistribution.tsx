import { Distribution } from "./Distribution";

/**
 * Distribution chart component for venue statistics.
 * @param props - Component props
 * @param props.values - Distribution data values
 * @returns Distribution chart for venues or false if no data
 */
export function VenueDistribution({
  values,
}: {
  values: React.ComponentProps<typeof Distribution>["values"];
}): false | React.JSX.Element {
  if (values.length === 0) {
    return false;
  }

  return <Distribution title="Top Venues" values={values} />;
}
