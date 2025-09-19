import type { UserEvent } from "@testing-library/user-event";

import { act, screen } from "@testing-library/react";
import { vi } from "vitest";

import { DROPDOWN_CLOSE_DELAY_MS } from "./MultiSelectField";

/**
 * Test helper to select an option in a multi-select field.
 * @param user - UserEvent instance for interactions
 * @param labelText - Label text to find the multi-select field
 * @param optionText - Option text to select
 */
export async function clickMultiSelectFieldOption(
  user: UserEvent,
  labelText: string,
  optionText: string,
) {
  const genresButton = screen.getByLabelText(labelText);

  // Click to open the dropdown
  await user.click(genresButton);

  // Select Action
  const option = await screen.findByRole("option", { name: optionText });
  await user.click(option);

  // Advance timers for dropdown to close
  act(() => {
    vi.advanceTimersByTime(DROPDOWN_CLOSE_DELAY_MS);
  });
}
