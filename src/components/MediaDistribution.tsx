import { Distribution } from "./Distribution";

export function MediaDistribution({
  values,
}: {
  values: React.ComponentProps<typeof Distribution>["values"];
}) {
  return <Distribution title="Top Media" values={values} />;
}
