import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

/**
 * Test helper to click the "Show More" button.
 * @param user - UserEvent instance for interactions
 */
export async function clickShowMore(user: UserEvent) {
  await user.click(screen.getByText("Show More"));
}

/**
 * Test helper to get the grouped poster list element.
 * @returns Grouped poster list DOM element
 */
export function getGroupedPosterList() {
  return screen.getByTestId("grouped-poster-list");
}

/**
 * Test helper to get the poster list element.
 * @returns Grouped poster list DOM element
 */
export function getPosterList() {
  return screen.getByTestId("poster-list");
}
