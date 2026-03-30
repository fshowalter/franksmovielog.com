import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { YearField } from "~/components/filter-and-sort/fields/YearField";

import type { ReleaseYearFilterChangedAction } from "./releaseYearReducer";

import { createReleaseYearFilterChangedAction } from "./releaseYearReducer";

export function ReleaseYearFacet({
  defaultValues,
  dispatch,
  distinctYears,
}: {
  defaultValues: readonly [string, string] | undefined;
  dispatch: React.Dispatch<ReleaseYearFilterChangedAction>;
  distinctYears: readonly string[];
}): React.JSX.Element {
  return (
    <AnimatedDetailsDisclosure title="Release Year">
      <YearField
        defaultValues={defaultValues}
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
        years={distinctYears}
      />
    </AnimatedDetailsDisclosure>
  );
}
