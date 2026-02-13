import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";

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
  // Find the fieldset with matching legend that contains a group (CheckboxListField pattern)
  const fieldsets = screen.queryAllByRole("group").map((group) => {
    // Check if this group is inside a fieldset
    const fieldset = group.closest("fieldset");
    return fieldset;
  }).filter(Boolean);

  const targetFieldset = fieldsets.find((fieldset) => {
    const legend = fieldset?.querySelector("legend");
    return legend?.textContent?.includes(fieldLabel);
  });

  if (!targetFieldset) {
    throw new Error(`Unable to find checkbox list field with label "${fieldLabel}"`);
  }

  // Get the group inside the fieldset
  const targetGroup = targetFieldset.querySelector('[role="group"]');

  if (!targetGroup) {
    throw new Error(`Unable to find group inside checkbox list field with label "${fieldLabel}"`);
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
