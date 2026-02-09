import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import {
  clickRadioListFieldOption,
  getRadioListFieldValue,
} from "~/components/fields/RadioListField.testHelper";

/**
 * Test helper to select a credited-as filter option.
 * @param user - UserEvent instance for interactions
 * @param value - The credited-as option to select
 */
export async function clickCreditedAsFilterOption(
  user: UserEvent,
  value: "All" | "Director" | "Performer" | "Writer",
) {
  await clickRadioListFieldOption(user, "Credited As", value);
}

/**
 * Test helper to get the credited-as filter current value.
 * @returns Currently selected credited-as value
 */
export function getCreditedAsFilter(): string {
  return getRadioListFieldValue("Credited As");
}

/**
 * Test helper to get the credited-as filter section element.
 * @returns Credited-as filter section DOM element
 */
export function getCreditedAsFilterSection() {
  return screen.getByRole("group", { name: /Credited As/i });
}
