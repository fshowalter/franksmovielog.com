import { screen } from "@testing-library/react";

export function getGroupedPosterList() {
  return screen.getByTestId("grouped-poster-list");
}
