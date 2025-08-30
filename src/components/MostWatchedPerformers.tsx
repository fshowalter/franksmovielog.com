import type { MostWatchedPeopleListItemValue } from "./MostWatchedPeople";

import { MostWatchedPeople } from "./MostWatchedPeople";

export function MostWatchedPerformers({
  values,
}: {
  values: readonly MostWatchedPeopleListItemValue[];
}): React.JSX.Element {
  return <MostWatchedPeople header="Most Watched Performers" values={values} />;
}
