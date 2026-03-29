import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { getAnimatedDetailsDisclosureElement } from "~/components/animated-details-disclosure/AnimatedDetailsDisclosure.testHelper";
import { clickCheckboxListFieldOption } from "~/components/filter-and-sort/fields/CheckboxListField.testHelper";
import { fillTextField } from "~/components/filter-and-sort/fields/TextField.testHelper";
import { fillYearField } from "~/components/filter-and-sort/fields/YearField.testHelper";

/**
 * Test helper to select a genre filter option.
 * @param user - UserEvent instance for interactions
 * @param value - Genre name to select
 */
export async function clickGenresFilterOption(user: UserEvent, value: string) {
  const filter = getAnimatedDetailsDisclosureElement("Genres");
  await clickCheckboxListFieldOption(filter, user, value);
}

/**
 * Test helper to fill the release year filter range.
 * @param user - UserEvent instance for interactions
 * @param value1 - From year value
 * @param value2 - To year value
 */
export async function fillReleaseYearFilter(
  user: UserEvent,
  value1: string,
  value2: string,
) {
  await fillYearField(user, "Release Year", value1, value2);
}

/**
 * Test helper to fill the title filter field.
 * @param user - UserEvent instance for interactions
 * @param value - Title text to enter
 */
export async function fillTitleFilter(user: UserEvent, value: string) {
  await fillTextField(user, "Title", value);
}

export async function fillViewingYearFilter(
  user: UserEvent,
  value1: string,
  value2: string,
) {
  await fillYearField(user, "Viewing Year", value1, value2);
}

/**
 * Test helper to get the title filter element.
 * @returns Title filter DOM element
 */
export function getTitleFilter() {
  return screen.getByLabelText("Title");
}
