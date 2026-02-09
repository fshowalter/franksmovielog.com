import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";

import { clickRadioListOption } from "~/components/fields/RadioListField.testHelper";

/**
 * Clicks a collection filter option in tests.
 * @param user - User event instance
 * @param value - Filter value to select
 */
export async function clickCollectionFilterOption(
  user: UserEvent,
  value: string,
) {
  await clickRadioListOption(user, "Collection", value);
}

/**
 * Clicks a director filter option in tests.
 * @param user - User event instance
 * @param value - Filter value to select
 */
export async function clickDirectorFilterOption(
  user: UserEvent,
  value: string,
) {
  await clickRadioListOption(user, "Director", value);
}

/**
 * Clicks a performer filter option in tests.
 * @param user - User event instance
 * @param value - Filter value to select
 */
export async function clickPerformerFilterOption(
  user: UserEvent,
  value: string,
) {
  await clickRadioListOption(user, "Performer", value);
}

/**
 * Clicks a writer filter option in tests.
 * @param user - User event instance
 * @param value - Filter value to select
 */
export async function clickWriterFilterOption(user: UserEvent, value: string) {
  await clickRadioListOption(user, "Writer", value);
}

/**
 * Gets the "All" radio button from the director filter (for checking if filter is cleared).
 * @returns The "All" radio button element
 */
export function getDirectorFilter() {
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
    summary.textContent?.includes("Director"),
  );

  if (!filterSummary) {
    throw new Error("Unable to find Director FilterSection");
  }

  // Find the details element that contains this summary
  const detailsElement = filterSummary.closest("details");
  if (!detailsElement) {
    throw new Error("Unable to find details element for Director");
  }

  // Find the "All" radio button within this section (value is "All")
  const radios = within(detailsElement).getAllByRole("radio");
  const allRadio = radios.find((rb) => (rb as HTMLInputElement).value === "All");

  if (!allRadio) {
    throw new Error('Unable to find "All" radio button in Director filter');
  }

  return allRadio;
}
