import type { UserEvent } from "@testing-library/user-event";

import { clickCheckboxListOption } from "~/components/fields/CheckboxListField.testHelper";

/**
 * Test helper to select a reviewed status filter option.
 * @param user - UserEvent instance for interactions
 * @param reviewedStatus - The reviewed status option to select
 */
export async function clickReviewedStatusFilterOption(
  user: UserEvent,
  reviewedStatus: "Not Reviewed" | "Reviewed",
) {
  await clickCheckboxListOption(user, "Reviewed Status", reviewedStatus);
}
