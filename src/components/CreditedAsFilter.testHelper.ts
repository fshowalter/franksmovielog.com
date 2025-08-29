import type { UserEvent } from "@testing-library/user-event";

import { clickSelectField } from "./SelectField.testHelper";

export async function clickCreditedAsFilter(
  user: UserEvent,
  value: "All" | "Director" | "Performer" | "Writer",
) {
  await clickSelectField(user, "Credited As", value);
}
