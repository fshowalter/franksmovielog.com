import type { UserEvent } from "@testing-library/user-event";

import { clickSelectField } from "./SelectField.testHelper";

export async function clickReviewedStatus(
  user: UserEvent,
  reviewedStatus: "All" | "Not Reviewed" | "Reviewed",
) {
  await clickSelectField(user, "Reviewed Status", reviewedStatus);
}
