import { useReducer } from "react";

import type { AvatarImageProps } from "~/api/avatars";

import { AvatarList } from "~/components/avatar-list/AvatarList";
import { COLLECTION_SORT_OPTIONS } from "~/components/filter-and-sort/CollectionSortOptions";
import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { useFilteredValues } from "~/hooks/useFilteredValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { CollectionsSort } from "./sortCollections";

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
} from "./Collections.reducer";
import { CollectionsFilters } from "./CollectionsFilters";
import { CollectionsListItem } from "./CollectionsListItem";
import { filterCollections } from "./filterCollections";
import { sortCollections } from "./sortCollections";

/**
 * Props for the Collections component.
 */
export type CollectionsProps = {
  initialSort: CollectionsSort;
  values: CollectionsValue[];
};

/**
 * Value object for a collection item.
 */
export type CollectionsValue = {
  avatarImageProps: AvatarImageProps | undefined;
  name: string;
  reviewCount: number;
  slug: string;
};

/**
 * Collections component for displaying and filtering collection items.
 * @param props - Component props
 * @param props.initialSort - Initial sort configuration
 * @param props.values - Collection values to display
 * @returns Collections component with filtering and sorting capabilities
 */
export function Collections({
  initialSort,
  values,
}: CollectionsProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    createInitialState,
  );

  const filteredValues = useFilteredValues(
    sortCollections,
    filterCollections,
    state.values,
    state.sort,
    state.activeFilterValues,
  );

  const pendingFilteredCount = usePendingFilterCount(
    filterCollections,
    state.values,
    state.pendingFilterValues,
  );

  const hasPendingFilters = selectHasPendingFilters(state);

  // AIDEV-NOTE: Applied filters only show after clicking "View X results" to avoid layout shift
  const activeFilters = buildAppliedFilterChips(state.activeFilterValues);

  return (
    <FilterAndSortContainer
      activeFilters={activeFilters}
      filters={
        <CollectionsFilters
          dispatch={dispatch}
          filterValues={state.pendingFilterValues}
        />
      }
      hasPendingFilters={hasPendingFilters}
      onApplyFilters={() => dispatch(createApplyFiltersAction())}
      onClearFilters={() => {
        dispatch(createClearFiltersAction());
      }}
      onFilterDrawerOpen={() => dispatch(createResetFiltersAction())}
      onRemoveFilter={(filterId) =>
        dispatch(createRemoveAppliedFilterAction(filterId))
      }
      onResetFilters={() => {
        dispatch(createResetFiltersAction());
      }}
      pendingFilteredCount={pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sort,
        onSortChange: (e) =>
          dispatch(createSortAction(e.target.value as CollectionsSort)),
        sortOptions: COLLECTION_SORT_OPTIONS,
      }}
      totalCount={filteredValues.length}
    >
      <AvatarList
        className={`
          mt-4 bg-subtle
          tablet-landscape:my-24
        `}
      >
        {filteredValues.map((value) => {
          return <CollectionsListItem key={value.name} value={value} />;
        })}
      </AvatarList>
    </FilterAndSortContainer>
  );
}
