import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { clickSelectField } from "./SelectField.testHelper";

export async function clickCreditedAsFilter(
  user: UserEvent,
  value: "All" | "Director" | "Performer" | "Writer",
) {
  await clickSelectField(user, "Credited As", value);
}

export function getCreditedAsFilter() {
  return screen.getByLabelText("Credited As");
}
