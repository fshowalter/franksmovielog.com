import type { UserEvent } from "@testing-library/user-event";

import { act, screen } from "@testing-library/react";
import { vi } from "vitest";

import { DROPDOWN_CLOSE_DELAY_MS } from "./MultiSelectField";

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
