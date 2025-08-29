import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

export async function clickReviewedStatus(
  user: UserEvent,
  reviewedStatus: "All" | "Not Reviewed" | "Reviewed",
) {
  await user.selectOptions(
    screen.getByLabelText("Reviewed Status"),
    reviewedStatus,
  );
}
