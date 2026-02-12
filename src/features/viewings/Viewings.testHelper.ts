import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { clickCheckboxListOption } from "~/components/fields/CheckboxListField.testHelper";
import { clickRadioListOption } from "~/components/fields/RadioListField.testHelper";
import { fillYearField } from "~/components/fields/YearField.testHelper";

/**
 * Clicks a medium filter option (checkbox) in tests.
 * @param user - User event instance
 * @param value - Filter value to select
 */
export async function clickMediumFilterOption(user: UserEvent, value: string) {
  // Medium filter uses CheckboxListField, so find by checkbox value directly
  // First expand "Show more" if needed
  const showMoreButtons = screen.queryAllByRole("button", {
    name: /\+ Show more/,
  });

  // Look for the checkbox
  let checkbox = screen.queryByRole("checkbox", { name: new RegExp(value) });

  // If not found and there's a "Show more" button, click it
  if (!checkbox && showMoreButtons.length > 0) {
    // Find the Medium section first
    const mediumDetails = screen.getAllByRole("group").find((group) => {
      const summary = group.previousElementSibling;
      return summary?.textContent?.includes("Medium");
    });

    if (mediumDetails) {
      const showMore = within(mediumDetails as HTMLElement).queryByRole("button", {
        name: /\+ Show more/,
      });
      if (showMore) {
        await user.click(showMore);
      }
    }

    checkbox = screen.queryByRole("checkbox", { name: new RegExp(value) });
  }

  if (!checkbox) {
    throw new Error(`Unable to find checkbox for medium "${value}"`);
  }

  await user.click(checkbox);
}

/**
 * Clicks the next month navigation button.
 * @param user - User event instance
 */
export async function clickNextMonthButton(user: UserEvent) {
  // Find and click the next month button first to ensure we can go back
  const nextMonthButton = await screen.findByRole("button", {
    name: /Navigate to next month:/,
  });
  await user.click(nextMonthButton);
}

/**
 * Clicks the previous month navigation button.
 * @param user - User event instance
 */
export async function clickPreviousMonthButton(user: UserEvent) {
  // Find and click the next month button first to ensure we can go back
  const previousMonthButton = await screen.findByRole("button", {
    name: /Navigate to previous month:/,
  });
  await user.click(previousMonthButton);
}

/**
 * Clicks a venue filter option in tests.
 * @param user - User event instance
 * @param value - Filter value to select
 */
export async function clickVenueFilterOption(user: UserEvent, value: string) {
  await clickRadioListOption(user, "Venue", value);
}

/**
 * Fills the viewing year filter range.
 * @param user - User event instance
 * @param year1 - Start year
 * @param year2 - End year
 */
export async function fillViewingYearFilter(
  user: UserEvent,
  year1: string,
  year2: string,
) {
  await fillYearField(user, "Viewing Year", year1, year2);
}

/**
 * Gets the calendar element.
 * @returns Calendar element
 */
export function getCalendar() {
  return screen.getByTestId("calendar");
}

/**
 * Gets the selected medium filter values (as array).
 * @returns Object with values property containing the selected medium values
 */
export function getMediumFilter(): { values: string[] } {
  // Find all groups and filter for the one with Medium in the legend
  const groups = screen.queryAllByRole("group");
  const mediumGroup = groups.find((group) => {
    const legend = group.querySelector("legend");
    return legend?.textContent?.includes("Medium");
  });

  if (!mediumGroup) {
    // If group not found, return empty array as default (filter section may be closed)
    return { values: [] };
  }

  // Find all checked checkboxes
  const checkboxes = mediumGroup.querySelectorAll('input[type="checkbox"]');
  const checkedValues = [...checkboxes]
    .filter((checkbox) => (checkbox as HTMLInputElement).checked)
    .map((checkbox) => (checkbox as HTMLInputElement).value);

  return { values: checkedValues };
}

/**
 * Queries for the next month button.
 * @returns Next month button element or null
 */
export function queryNextMonthButton() {
  return screen.queryByRole("button", {
    name: /Navigate to next month:/,
  });
}

/**
 * Queries for the previous month button.
 * @returns Previous month button element or null
 */
export function queryPreviousMonthButton() {
  return screen.queryByRole("button", {
    name: /Navigate to previous month:/,
  });
}
