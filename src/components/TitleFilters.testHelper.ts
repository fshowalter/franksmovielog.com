import type { UserEvent } from "@testing-library/user-event";

import { screen, within } from "@testing-library/react";

import { clickMultiSelectField } from "./MultiSelectField.testHelper";
import { fillTextField } from "./TextField.testHelper";
import { fillYearField } from "./YearField.testHelper";

export async function clickGenreFilter(user: UserEvent, value: string) {
  await clickMultiSelectField(user, "Genres", value);
}

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

export async function fillReleaseYearFilter(
  user: UserEvent,
  value1: string,
  value2: string,
) {
  await fillYearField(user, "Release Year", value1, value2);
}

export async function fillReviewYearFilter(
  user: UserEvent,
  value1: string,
  value2: string,
) {
  await fillYearField(user, "Review Year", value1, value2);
}

export async function fillTitleFilter(user: UserEvent, value: string) {
  await fillTextField(user, "Title", value);
}

export function getTitleFilter() {
  return screen.getByLabelText("Title");
}
