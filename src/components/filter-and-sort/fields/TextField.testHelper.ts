import type { UserEvent } from "@testing-library/user-event";

import { act, screen } from "@testing-library/react";
import { vi } from "vitest";

import { TEXT_FILTER_DEBOUNCE_MS } from "./TextField";

/**
 * Fills a text field and waits for debounce in tests.
 * @param user - UserEvent instance from testing library
 * @param labelText - The label text to find the field
 * @param value - The value to type into the field
 * @returns Promise that resolves when typing and debounce are complete
 */
export async function fillTextField(
  user: UserEvent,
  labelText: string,
  value: string,
) {
  // Apply multiple filters
  await user.type(screen.getByLabelText(labelText), value);
  act(() => {
    vi.advanceTimersByTime(TEXT_FILTER_DEBOUNCE_MS);
  });
}
