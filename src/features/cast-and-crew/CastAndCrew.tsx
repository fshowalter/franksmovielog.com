import { useReducer } from "react";

import type { AvatarImageProps } from "~/api/avatars";

import { GroupedAvatarList } from "~/components/avatar-list/GroupedAvatarList";
import { CollectionSortOptions } from "~/components/filter-and-sort/CollectionSortOptions";
import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { useGroupedValues } from "~/hooks/useGroupedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { CastAndCrewSort } from "./sortCastAndCrew";

import { AlphabetSubNav } from "./AlphabetSubNav";
import { buildAppliedFilterChips } from "./appliedFilterChips";
import {
  createApplyFiltersAction,
  createClearFiltersAction,
  createInitialState,
  createRemoveAppliedFilterAction,
  createResetFiltersAction,
  createSortAction,
  reducer,
  selectHasPendingFilters,
} from "./CastAndCrew.reducer";
import { CastAndCrewFilters } from "./CastAndCrewFilters";
import { CastAndCrewListItem } from "./CastAndCrewListItem";
import { filterCastAndCrew } from "./filterCastAndCrew";
import { groupCastAndCrew } from "./groupCastAndCrew";
import { sortCastAndCrew } from "./sortCastAndCrew";

/**
 * Props for the CastAndCrew component.
 */
export type CastAndCrewProps = {
  initialSort: CastAndCrewSort;
  values: CastAndCrewValue[];
};

/**
 * Value object for a cast or crew member.
 */
export type CastAndCrewValue = {
  avatarImageProps: AvatarImageProps | undefined;
  creditedAs: string[];
  name: string;
  reviewCount: number;
  slug: string;
};

/**
 * CastAndCrew component for displaying and filtering cast and crew members.
 * @param props - Component props
 * @param props.initialSort - Initial sort configuration
 * @param props.values - Cast and crew values to display
 * @returns CastAndCrew component with filtering and sorting capabilities
 */
export function CastAndCrew({
  initialSort,
  values,
}: CastAndCrewProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    createInitialState,
  );

  const [groupedValues, totalCount] = useGroupedValues(
    sortCastAndCrew,
    filterCastAndCrew,
    groupCastAndCrew,
    state.values,
    state.sort,
    state.activeFilterValues,
  );

  const pendingFilteredCount = usePendingFilterCount(
    filterCastAndCrew,
    state.values,
    state.pendingFilterValues,
  );

  const hasPendingFilters = selectHasPendingFilters(state);

  const activeFilters = buildAppliedFilterChips(state.pendingFilterValues);

  return (
    <FilterAndSortContainer
      activeFilters={activeFilters}
      filters={
        <CastAndCrewFilters
          dispatch={dispatch}
          filterValues={state.pendingFilterValues}
          values={values}
        />
      }
      hasPendingFilters={hasPendingFilters}
      onApplyFilters={() => dispatch(createApplyFiltersAction())}
      onClearFilters={() => {
        dispatch(createClearFiltersAction());
      }}
      onFilterDrawerOpen={() => dispatch(createResetFiltersAction())}
      onRemoveFilter={(filterKey) => {
        dispatch(createRemoveAppliedFilterAction(filterKey));
      }}
      onResetFilters={() => {
        dispatch(createResetFiltersAction());
      }}
      pendingFilteredCount={pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sort,
        onSortChange: (e) =>
          dispatch(createSortAction(e.target.value as CastAndCrewSort)),
        sortOptions: <CollectionSortOptions />,
      }}
      subNav={
        <AlphabetSubNav groupedValues={groupedValues} sortValue={state.sort} />
      }
      totalCount={totalCount}
    >
      <GroupedAvatarList
        groupedValues={groupedValues}
        groupItemClassName={`scroll-mt-[var(--filter-and-sort-container-scroll-offset)]`}
      >
        {(value) => {
          return <CastAndCrewListItem key={value.name} value={value} />;
        }}
      </GroupedAvatarList>
    </FilterAndSortContainer>
  );
}
