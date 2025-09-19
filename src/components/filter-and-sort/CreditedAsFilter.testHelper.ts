import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { clickSelectFieldOption } from "~/components/fields/SelectField.testHelper";

/**
 * Test helper to select a credited-as filter option.
 * @param user - UserEvent instance for interactions
 * @param value - The credited-as option to select
 */
export async function clickCreditedAsFilterOption(
  user: UserEvent,
  value: "All" | "Director" | "Performer" | "Writer",
) {
  await clickSelectFieldOption(user, "Credited As", value);
}

/**
 * Test helper to get the credited-as filter element.
 * @returns Credited-as filter DOM element
 */
export function getCreditedAsFilter() {
  return screen.getByLabelText("Credited As");
}
