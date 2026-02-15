import { screen } from "@testing-library/react";

/**
 * Test helper to get the grouped poster list element.
 * @returns Grouped poster list DOM element
 */
export function getGroupedReviewCardList() {
  return screen.getByTestId("grouped-review-card-list");
}

export function getReviewCardList() {
  return screen.getByTestId("review-card-list");
}
