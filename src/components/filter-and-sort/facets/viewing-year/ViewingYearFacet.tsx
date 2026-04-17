import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { YearField } from "~/components/filter-and-sort/fields/YearField";

import type { ViewingYearFilterChangedAction } from "./viewingYearReducer";

import { createViewingYearFilterChangedAction } from "./viewingYearReducer";

export function ViewingYearFacet({
  dispatch,
  distinctYears,
  selectedValues,
}: {
  dispatch: React.Dispatch<ViewingYearFilterChangedAction>;
  distinctYears: readonly string[];
  selectedValues: readonly [string, string] | undefined;
}): React.JSX.Element {
  return (
    <AnimatedDetailsDisclosure title="Viewing Year">
      <YearField
        allValues={distinctYears}
        label="Viewing Year"
        onYearChange={(values) =>
          dispatch(
            createViewingYearFilterChangedAction(
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
