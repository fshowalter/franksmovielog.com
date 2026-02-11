import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";

/**
 * Test helper to click a radio button option in a radio list field.
 * @param user - UserEvent instance for interactions
 * @param fieldLabel - Label of the radio list field (e.g., "Director", "Performer")
 * @param optionValue - Value of the radio button option to select
 */
export async function clickRadioListOption(
  user: UserEvent,
  fieldLabel: string,
  optionValue: string,
) {
  // Find all details elements (FilterSections)
  const allDetailsElements = screen.queryAllByRole("group");
  const summaries: HTMLElement[] = [];

  // Get the summary element from each details
  for (const details of allDetailsElements) {
    const summary = details.querySelector("summary");
    if (summary) {
      summaries.push(summary);
    }
  }

  const filterSummary = summaries.find((summary) =>
    summary.textContent?.includes(fieldLabel),
  );

  if (!filterSummary) {
    throw new Error(
      `Unable to find FilterSection with label "${fieldLabel}". Available sections: ${summaries.map((s) => s.textContent).join(", ")}`,
    );
  }

  // Find the details element that contains this summary
  const detailsElement = filterSummary.closest("details");
  if (!detailsElement) {
    throw new Error(`Unable to find details element for "${fieldLabel}"`);
  }

  // Expand the section if it's collapsed
  if (!detailsElement.open) {
    await user.click(filterSummary);
  }

  // Find the radio button within this section
  const radios = within(detailsElement).getAllByRole("radio");
  const radio = radios.find(
    (rb) => (rb as HTMLInputElement).value === optionValue,
  );

  if (!radio) {
    throw new Error(
      `Unable to find radio button with value "${optionValue}" in section "${fieldLabel}". Available values: ${radios.map((rb) => (rb as HTMLInputElement).value).join(", ")}`,
    );
  }

  await user.click(radio);
}

/**
 * Test helper to get a radio button option element by value.
 * @param optionValue - Value of the radio button option
 * @returns Radio button element
 */
function getRadioListOption(optionValue: string) {
  const radios = screen.getAllByRole("radio");
  const radio = radios.find(
    (rb) => (rb as HTMLInputElement).value === optionValue,
  );

  if (!radio) {
    throw new Error(
      `Unable to find radio button with value "${optionValue}". Available values: ${radios.map((rb) => (rb as HTMLInputElement).value).join(", ")}`,
    );
  }

  return radio;
}
