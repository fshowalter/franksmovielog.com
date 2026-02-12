import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { clickCheckboxListOption } from "~/components/fields/CheckboxListField.testHelper";

/**
 * Test helper to select a credited-as filter option.
 * Now uses checkboxes for multi-select (matching Orbit DVD pattern).
 * @param user - UserEvent instance for interactions
 * @param value - The credited-as option to select (supports both lowercase and capitalized forms)
 */
export async function clickCreditedAsFilterOption(
  user: UserEvent,
  value: "director" | "Director" | "performer" | "Performer" | "writer" | "Writer",
) {
  await clickCheckboxListOption(user, "Credited As", value);
}

/**
 * Test helper to get the credited-as filter current values.
 * @returns Array of currently selected credited-as values
 */
export function getCreditedAsFilter(): string[] {
  const filterSection = screen.getByRole("group", { name: /Credited As/i });
  const checkedBoxes = filterSection.querySelectorAll<HTMLInputElement>(
    'input[type="checkbox"]:checked',
  );
  return Array.from(checkedBoxes).map((checkbox) => checkbox.value);
}
