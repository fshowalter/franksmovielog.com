import { AnimatedDetailsDisclosure } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure";
import { CheckboxListField } from "~/components/filter-and-sort/fields/CheckboxListField";

import type { VenueFilterChangedAction } from "./venueReducer";

import { createVenueCountMap } from "./venueFilter";
import { createVenueFilterChangedAction } from "./venueReducer";

export function VenueFacet<
  TValue extends Parameters<typeof createVenueCountMap>[0][number],
  TFilters extends Parameters<typeof createVenueCountMap>[1],
>({
  dispatch,
  distinctVenues,
  filterer,
  filterValues,
  values,
}: {
  dispatch: React.Dispatch<VenueFilterChangedAction>;
  distinctVenues: readonly string[];
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[];
  filterValues: TFilters;
  values: readonly TValue[];
}): React.JSX.Element {
  const venueCounts = createVenueCountMap(values, filterValues, filterer);

  return (
    <AnimatedDetailsDisclosure title="Venue">
      <CheckboxListField
        label="Venue"
        onChange={(values) => dispatch(createVenueFilterChangedAction(values))}
        options={distinctVenues.map((e) => ({
          count: venueCounts.get(e) ?? 0,
          label: e,
          value: e,
        }))}
        selectedValues={filterValues.venue}
      />
    </AnimatedDetailsDisclosure>
  );
}
