import { useReducer } from "react";

import type { AvatarImageProps } from "~/api/avatars";

import { GroupedAvatarList } from "~/components/avatar-list/GroupedAvatarList";
import { COLLECTION_SORT_OPTIONS } from "~/components/filter-and-sort/CollectionSortOptions";
import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { useGroupedValues } from "~/hooks/useGroupedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { CastAndCrewSort } from "./sortCastAndCrew";

import { AlphabetSideNav } from "./AlphabetSideNav";
import { buildAppliedFilterChips } from "./appliedFilterChips";
import {
  createApplyFiltersAction,
  createClearFiltersAction,
  createCreditedAsFilterChangedAction,
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

  // AIDEV-NOTE: Applied filters only show after clicking "View X results" to avoid layout shift
  const activeFilters = buildAppliedFilterChips(state.activeFilterValues);

  // Custom handler for removing individual creditedAs values
  function handleRemoveAppliedFilter(filterId: string): void {
    if (filterId.startsWith("creditedAs-")) {
      const roleToRemove = filterId.replace("creditedAs-", "");
      const currentRoles = state.pendingFilterValues.creditedAs || [];
      const updatedRoles = currentRoles.filter(
        (role) => role.toLowerCase() !== roleToRemove,
      );
      dispatch(createCreditedAsFilterChangedAction(updatedRoles));
    } else {
      dispatch(createRemoveAppliedFilterAction(filterId));
    }
  }

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
      onRemoveFilter={handleRemoveAppliedFilter}
      onResetFilters={() => {
        dispatch(createResetFiltersAction());
      }}
      pendingFilteredCount={pendingFilteredCount}
      sideNav={
        <AlphabetSideNav groupedValues={groupedValues} sortValue={state.sort} />
      }
      sortProps={{
        currentSortValue: state.sort,
        onSortChange: (e) =>
          dispatch(createSortAction(e.target.value as CastAndCrewSort)),
        sortOptions: COLLECTION_SORT_OPTIONS,
      }}
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
