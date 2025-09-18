import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { fillTextField } from "~/components/fields/TextField.testHelper";

/**
 * Test helper to fill the name filter field.
 * @param user - UserEvent instance for interactions
 * @param value - Text value to enter
 */
export async function fillNameFilter(user: UserEvent, value: string) {
  await fillTextField(user, "Name", value);
}

/**
 * Test helper to get the name filter element.
 * @returns Name filter DOM element
 */
export function getNameFilter() {
  return screen.getByLabelText("Name");
}
