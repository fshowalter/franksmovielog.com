import type { UserEvent } from "@testing-library/user-event";

import { within } from "@testing-library/dom";

export async function clickCheckboxListFieldOption(
  element: HTMLElement,
  user: UserEvent,
  value: string,
): Promise<void> {
  const showMore = within(element).queryByRole("button", {
    name: /show more/i,
  });
  if (showMore) await user.click(showMore);
  const checkbox = within(element).getByText(value);
  await user.click(checkbox);
}
