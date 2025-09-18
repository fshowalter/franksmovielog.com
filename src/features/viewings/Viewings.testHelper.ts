import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { clickSelectFieldOption } from "~/components/fields/SelectField.testHelper";
import { fillYearField } from "~/components/fields/YearField.testHelper";

/**
 * Clicks a medium filter option in tests.
 * @param user - User event instance
 * @param value - Filter value to select
 */
export async function clickMediumFilterOption(user: UserEvent, value: string) {
  await clickSelectFieldOption(user, "Medium", value);
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
  await clickSelectFieldOption(user, "Venue", value);
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
 * Gets the medium filter element.
 * @returns Medium filter element
 */
export function getMediumFilter() {
  return screen.getByLabelText("Medium");
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
