import type { MostWatchedPeopleListItemValue } from "./MostWatchedPeople";

import { MostWatchedPeople } from "./MostWatchedPeople";

/**
 * Component for displaying most watched writers.
 * @param props - Component props
 * @param props.values - Array of most watched writers
 * @returns Most watched writers list
 */
export function MostWatchedWriters({
  values,
}: {
  values: readonly MostWatchedPeopleListItemValue[];
}): React.JSX.Element {
  return <MostWatchedPeople header="Most Watched Writers" values={values} />;
}
