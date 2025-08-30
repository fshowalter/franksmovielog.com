import { screen } from "@testing-library/react";

export function getAvatarList() {
  return screen.getByTestId("avatar-list");
}

export function getGroupedAvatarList() {
  return screen.getByTestId("grouped-avatar-list");
}
