import { Distribution } from "./Distribution";

export function VenueDistribution({
  values,
}: {
  values: React.ComponentProps<typeof Distribution>["values"];
}) {
  if (values.length === 0) {
    return false;
  }

  return <Distribution title="Top Venues" values={values} />;
}
