import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

/**
 * Clicks the "Clear all filters" button in tests.
 * @param user - UserEvent instance from testing library
 * @returns Promise that resolves when click is complete
 */
export async function clickClearFilters(user: UserEvent) {
  return user.click(screen.getByRole("button", { name: "Clear all filters" }));
}

/**
 * Clicks the "Close filters" button to close the filter drawer.
 * @param user - UserEvent instance from testing library
 * @returns Promise that resolves when click is complete
 */
export async function clickCloseFilters(user: UserEvent) {
  // Close the drawer with the X button (should reset pending changes)
  await user.click(screen.getByRole("button", { name: "Close filters" }));
}

/**
 * Selects a sort option from the sort dropdown.
 * @param user - UserEvent instance from testing library
 * @param sortText - The text of the sort option to select
 * @returns Promise that resolves when selection is complete
 */
export async function clickSortOption(user: UserEvent, sortText: string) {
  await user.selectOptions(screen.getByLabelText("Sort"), sortText);
}

/**
 * Clicks the "Toggle filters" button to open/close filter drawer.
 * @param user - UserEvent instance from testing library
 * @returns Promise that resolves when click is complete
 */
export async function clickToggleFilters(user: UserEvent) {
  return user.click(screen.getByRole("button", { name: "Toggle filters" }));
}

/**
 * Clicks the "View Results" button to apply pending filters.
 * @param user - UserEvent instance from testing library
 * @returns Promise that resolves when click is complete
 */
export async function clickViewResults(user: UserEvent) {
  await user.click(screen.getByRole("button", { name: /View \d+ Results/ }));
}
