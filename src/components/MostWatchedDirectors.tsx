import type { MostWatchedPeopleListItemValue } from "./MostWatchedPeople";

import { MostWatchedPeople } from "./MostWatchedPeople";

export function MostWatchedDirectors({
  values,
}: {
  values: readonly MostWatchedPeopleListItemValue[];
}): React.JSX.Element {
  return <MostWatchedPeople header="Most Watched Directors" values={values} />;
}
