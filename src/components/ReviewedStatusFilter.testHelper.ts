import type { UserEvent } from "@testing-library/user-event";

import { clickSelectField } from "./SelectField.testHelper";

export async function clickReviewedStatusFilter(
  user: UserEvent,
  reviewedStatus: "All" | "Not Reviewed" | "Reviewed",
) {
  await clickSelectField(user, "Reviewed Status", reviewedStatus);
}
