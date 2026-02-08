import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

/**
 * Test helper to get a checkbox option element.
 * @param optionLabel - Label text of the checkbox option (matches the option value)
 * @returns Checkbox element
 */
export function getCheckboxListOption(optionLabel: string) {
  const checkboxes = screen.getAllByRole("checkbox");
  const checkbox = checkboxes.find(
    (cb) => (cb as HTMLInputElement).value === optionLabel,
  );

  if (!checkbox) {
    throw new Error(
      `Unable to find checkbox with value "${optionLabel}". Available values: ${checkboxes.map((cb) => (cb as HTMLInputElement).value).join(", ")}`,
    );
  }

  return checkbox;
}

/**
 * Test helper to toggle a checkbox option in a checkbox list field.
 * @param user - UserEvent instance for interactions
 * @param optionLabel - Label text of the checkbox option to toggle (matches the option value)
 */
export async function toggleCheckboxListOption(
  user: UserEvent,
  optionLabel: string,
) {
  // Try to find the checkbox - it might be hidden behind "Show more"
  let checkboxes = screen.getAllByRole("checkbox");
  let checkbox = checkboxes.find(
    (cb) => (cb as HTMLInputElement).value === optionLabel,
  );

  // If not found, try clicking "Show more" button
  if (!checkbox) {
    const showMoreButtons = screen.queryAllByRole("button", {
      name: /\+ Show \d+ more/,
    });

    if (showMoreButtons.length > 0) {
      // Click the first "Show more" button
      await user.click(showMoreButtons[0]);

      // Try finding the checkbox again
      checkboxes = screen.getAllByRole("checkbox");
      checkbox = checkboxes.find(
        (cb) => (cb as HTMLInputElement).value === optionLabel,
      );
    }
  }

  if (!checkbox) {
    throw new Error(
      `Unable to find checkbox with value "${optionLabel}". Available values: ${checkboxes.map((cb) => (cb as HTMLInputElement).value).join(", ")}`,
    );
  }

  await user.click(checkbox);
}
