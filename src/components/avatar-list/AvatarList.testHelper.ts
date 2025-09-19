import { screen } from "@testing-library/react";

/**
 * Test helper to get the avatar list element.
 * @returns Avatar list DOM element
 */
export function getAvatarList() {
  return screen.getByTestId("avatar-list");
}

/**
 * Test helper to get the grouped avatar list element.
 * @returns Grouped avatar list DOM element
 */
export function getGroupedAvatarList() {
  return screen.getByTestId("grouped-avatar-list");
}
