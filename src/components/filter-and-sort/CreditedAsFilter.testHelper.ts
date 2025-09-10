import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { clickSelectFieldOption } from "~/components/fields/SelectField.testHelper";

export async function clickCreditedAsFilterOption(
  user: UserEvent,
  value: "All" | "Director" | "Performer" | "Writer",
) {
  await clickSelectFieldOption(user, "Credited As", value);
}

export function getCreditedAsFilter() {
  return screen.getByLabelText("Credited As");
}
