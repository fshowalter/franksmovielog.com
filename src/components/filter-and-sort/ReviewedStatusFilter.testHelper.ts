import type { UserEvent } from "@testing-library/user-event";

import { clickRadioListOption } from "~/components/fields/RadioListField.testHelper";

/**
 * Test helper to select a reviewed status filter option.
 * @param user - UserEvent instance for interactions
 * @param reviewedStatus - The reviewed status option to select
 */
export async function clickReviewedStatusFilterOption(
  user: UserEvent,
  reviewedStatus: "All" | "Not Reviewed" | "Reviewed",
) {
  await clickRadioListOption(user, "Reviewed Status", reviewedStatus);
}
