import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { YearField } from "~/components/filter-and-sort/fields/YearField";

import type { ReviewYearFilterChangedAction } from "./reviewYearReducer";

import { createReviewYearFilterChangedAction } from "./reviewYearReducer";

export function ReviewYearFacet({
  dispatch,
  distinctYears,
  selectedValues,
}: {
  dispatch: React.Dispatch<ReviewYearFilterChangedAction>;
  distinctYears: readonly string[];
  selectedValues: readonly [string, string] | undefined;
}): React.JSX.Element {
  return (
    <AnimatedDetailsDisclosure title="Review Year">
      <YearField
        allValues={distinctYears}
        label="Review Year"
        onYearChange={(values) =>
          dispatch(
            createReviewYearFilterChangedAction(
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
