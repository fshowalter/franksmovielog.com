import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";

import { fillYearField } from "~/components/fields/YearField.testHelper";

export {
  clickGenresFilterOption,
  fillReleaseYearFilter,
  fillTitleFilter,
  getTitleFilter,
} from "./TitleFilters.testHelper";

/**
 * Test helper to fill the grade filter range.
 * @param user - UserEvent instance for interactions
 * @param value1 - From grade value
 * @param value2 - To grade value
 */
export async function fillGradeFilter(
  user: UserEvent,
  value1: string,
  value2: string,
) {
  const fieldset = screen.getByRole("group", { name: "Grade" });
  const fromInput = within(fieldset).getByLabelText("From");
  const toInput = within(fieldset).getByLabelText("to");

  await user.selectOptions(fromInput, value1);
  await user.selectOptions(toInput, value2);
}

/**
 * Test helper to fill the review year filter range.
 * @param user - UserEvent instance for interactions
 * @param value1 - From year value
 * @param value2 - To year value
 */
export async function fillReviewYearFilter(
  user: UserEvent,
  value1: string,
  value2: string,
) {
  await fillYearField(user, "Review Year", value1, value2);
}
