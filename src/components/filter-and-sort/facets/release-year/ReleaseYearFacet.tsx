import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { YearField } from "~/components/filter-and-sort/fields/YearField";

import type { ReleaseYearFilterChangedAction } from "./releaseYearReducer";

import { createReleaseYearFilterChangedAction } from "./releaseYearReducer";

export function ReleaseYearFacet({
  dispatch,
  distinctYears,
  selectedValues,
}: {
  dispatch: React.Dispatch<ReleaseYearFilterChangedAction>;
  distinctYears: readonly string[];
  selectedValues: readonly [string, string] | undefined;
}): React.JSX.Element {
  return (
    <AnimatedDetailsDisclosure title="Release Year">
      <YearField
        allValues={distinctYears}
        label="Release Year"
        onYearChange={(values) =>
          dispatch(
            createReleaseYearFilterChangedAction(
              values,
              distinctYears[0] ?? "",
              distinctYears.at(-1) ?? "",
            ),
          )
        }
        selectedValues={selectedValues}
      />
    </AnimatedDetailsDisclosure>
  );
}
