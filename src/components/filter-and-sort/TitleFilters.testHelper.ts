import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { clickMultiSelectFieldOption } from "~/components/fields/MultiSelectField.testHelper";
import { fillTextField } from "~/components/fields/TextField.testHelper";
import { fillYearField } from "~/components/fields/YearField.testHelper";

export async function clickGenresFilterOption(user: UserEvent, value: string) {
  await clickMultiSelectFieldOption(user, "Genres", value);
}

export async function fillReleaseYearFilter(
  user: UserEvent,
  value1: string,
  value2: string,
) {
  await fillYearField(user, "Release Year", value1, value2);
}

export async function fillTitleFilter(user: UserEvent, value: string) {
  await fillTextField(user, "Title", value);
}

export function getTitleFilter() {
  return screen.getByLabelText("Title");
}
