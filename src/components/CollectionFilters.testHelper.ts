import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { fillTextFilter } from "./TextFilter.testHelper";

export async function fillNameFilter(user: UserEvent, value: string) {
  await fillTextFilter(user, "Name", value);
}

export function getNameFilter() {
  return screen.getByLabelText("Name");
}
