import { Distribution } from "./Distribution";

export function MediaDistribution({
  values,
}: {
  values: React.ComponentProps<typeof Distribution>["values"];
}) {
  return <Distribution values={values} title="Top Media" />;
}
