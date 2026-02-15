import { screen } from "@testing-library/react";

export function getReviewCardList() {
  return screen.getByTestId("review-card-list");
}
