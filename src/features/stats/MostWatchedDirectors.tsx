import type { MostWatchedPeopleListItemValue } from "./MostWatchedPeople";

import { MostWatchedPeople } from "./MostWatchedPeople";

/**
 * Component for displaying most watched directors.
 * @param props - Component props
 * @param props.values - Array of most watched directors
 * @returns Most watched directors list
 */
export function MostWatchedDirectors({
  values,
}: {
  values: readonly MostWatchedPeopleListItemValue[];
}): React.JSX.Element {
  return <MostWatchedPeople header="Most Watched Directors" values={values} />;
}
