import type { MostWatchedPeopleListItemValue } from "./MostWatchedPeople";

import { MostWatchedPeople } from "./MostWatchedPeople";

export function MostWatchedWriters({
  values,
}: {
  values: readonly MostWatchedPeopleListItemValue[];
}): JSX.Element | null {
  return <MostWatchedPeople header="Most Watched Writers" values={values} />;
}
