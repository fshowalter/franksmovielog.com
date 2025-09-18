import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

/**
 * Test helper to select an option in a select field.
 * @param user - UserEvent instance for interactions
 * @param labelText - Label text to find the select field
 * @param optionText - Option text to select
 */
export async function clickSelectFieldOption(
  user: UserEvent,
  labelText: string,
  optionText: string,
) {
  await user.selectOptions(screen.getByLabelText(labelText), optionText);
}
