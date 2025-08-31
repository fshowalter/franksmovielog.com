import type { UserEvent } from "@testing-library/user-event";

import { clickSelectFieldOption } from "./SelectField.testHelper";

export async function clickReviewedStatusFilterOption(
  user: UserEvent,
  reviewedStatus: "All" | "Not Reviewed" | "Reviewed",
) {
  await clickSelectFieldOption(user, "Reviewed Status", reviewedStatus);
}
