import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { YearField } from "~/components/filter-and-sort/fields/YearField";

import type { ViewingYearFilterChangedAction } from "./viewingYearReducer";

import { createViewingYearFilterChangedAction } from "./viewingYearReducer";

export function ViewingYearFacet({
  defaultValues,
  dispatch,
  distinctYears,
}: {
  defaultValues: readonly [string, string] | undefined;
  dispatch: React.Dispatch<ViewingYearFilterChangedAction>;
  distinctYears: readonly string[];
}): React.JSX.Element {
  return (
    <AnimatedDetailsDisclosure title="Viewing Year">
      <YearField
        defaultValues={defaultValues}
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
        years={distinctYears}
      />
    </AnimatedDetailsDisclosure>
  );
}
