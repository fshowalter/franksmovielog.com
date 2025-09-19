import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";

/**
 * Fills a year range field with from and to years.
 * @param user - UserEvent instance from testing library
 * @param labelText - The fieldset label text
 * @param year1 - The "from" year value
 * @param year2 - The "to" year value
 * @returns Promise that resolves when selection is complete
 */
export async function fillYearField(
  user: UserEvent,
  labelText: string,
  year1: string,
  year2: string,
) {
  const fieldset = screen.getByRole("group", { name: labelText });
  const fromInput = within(fieldset).getByLabelText("From");
  const toInput = within(fieldset).getByLabelText("to");

  await user.selectOptions(fromInput, year1);
  await user.selectOptions(toInput, year2);
}
