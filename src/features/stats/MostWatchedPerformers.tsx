import type { MostWatchedPeopleListItemValue } from "./MostWatchedPeople";

import { MostWatchedPeople } from "./MostWatchedPeople";

/**
 * Component for displaying most watched performers.
 * @param props - Component props
 * @param props.values - Array of most watched performers
 * @returns Most watched performers list
 */
export function MostWatchedPerformers({
  values,
}: {
  values: readonly MostWatchedPeopleListItemValue[];
}): React.JSX.Element {
  return <MostWatchedPeople header="Most Watched Performers" values={values} />;
}
