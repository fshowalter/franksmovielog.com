import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { clickRadioListOption } from "~/components/fields/RadioListField.testHelper";

/**
 * Test helper to select a credited-as filter option.
 * @param user - UserEvent instance for interactions
 * @param value - The credited-as option to select (supports both lowercase and capitalized forms)
 */
export async function clickCreditedAsFilterOption(
  user: UserEvent,
  value:
    | "All"
    | "Director"
    | "Performer"
    | "Writer"
    | "director"
    | "performer"
    | "writer",
) {
  await clickRadioListOption(user, "Credited As", value);
}

/**
 * Test helper to get the credited-as filter current value.
 * @returns Currently selected credited-as value
 */
export function getCreditedAsFilter(): string {
  const filterSection = screen.getByRole("group", { name: /Credited As/i });
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const checkedRadio = filterSection.querySelector(
    'input[type="radio"]:checked',
  ) as HTMLInputElement | null;
  if (!checkedRadio) {
    throw new Error("No credited-as filter option is selected");
  }
  return checkedRadio.value;
}

/**
 * Test helper to get the credited-as filter section element.
 * @returns Credited-as filter section DOM element
 */
export function getCreditedAsFilterSection() {
  return screen.getByRole("group", { name: /Credited As/i });
}
