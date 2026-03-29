import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";

/**
 * Creates a userEvent instance configured with fake timers for testing.
 * @returns UserEvent instance with fake timer support
 */
export function getUserWithFakeTimers() {
  return userEvent.setup({
    advanceTimers: vi.advanceTimersByTime,
  });
}
