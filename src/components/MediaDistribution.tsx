import { Distribution } from "./Distribution";

export function MediaDistribution({
  values,
}: {
  values: React.ComponentProps<typeof Distribution>["values"];
}) {
  if (values.length === 0) {
    return false;
  }

  return <Distribution title="Top Media" values={values} />;
}
