import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";

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
      name: /\+ Show more/,
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

/**
 * Test helper to click a checkbox option in a specific checkbox list field by label.
 * @param user - UserEvent instance for interactions
 * @param fieldLabel - Label of the checkbox list field (e.g., "Medium", "Genres")
 * @param optionValue - Value of the checkbox option to click
 */
export async function clickCheckboxListOption(
  user: UserEvent,
  fieldLabel: string,
  optionValue: string,
) {
  // Find all groups and filter for the one with the matching VISIBLE legend (not sr-only)
  const groups = screen.queryAllByRole("group");
  const targetGroup = groups.find((group) => {
    const legend = group.querySelector("legend");
    // Check if legend exists, includes fieldLabel, and is not sr-only
    if (!legend || !legend.textContent?.includes(fieldLabel)) {
      return false;
    }
    // Exclude sr-only legends (RangeSliderField uses sr-only legends)
    const isSrOnly = legend.classList.contains("sr-only");
    return !isSrOnly;
  });

  if (!targetGroup) {
    throw new Error(`Unable to find checkbox list field with label "${fieldLabel}"`);
  }

  // Try to find the checkbox - it might be hidden behind "Show more"
  let checkboxes = within(targetGroup).getAllByRole("checkbox");
  let checkbox = checkboxes.find(
    (cb) => (cb as HTMLInputElement).value === optionValue,
  );

  // If not found, try clicking "Show more" button
  if (!checkbox) {
    const showMoreButton = within(targetGroup).queryByRole("button", {
      name: /\+ Show more/,
    });

    if (showMoreButton) {
      await user.click(showMoreButton);

      // Try finding the checkbox again
      checkboxes = within(targetGroup).getAllByRole("checkbox");
      checkbox = checkboxes.find(
        (cb) => (cb as HTMLInputElement).value === optionValue,
      );
    }
  }

  if (!checkbox) {
    throw new Error(
      `Unable to find checkbox with value "${optionValue}" in field "${fieldLabel}". Available values: ${checkboxes.map((cb) => (cb as HTMLInputElement).value).join(", ")}`,
    );
  }

  await user.click(checkbox);
}
