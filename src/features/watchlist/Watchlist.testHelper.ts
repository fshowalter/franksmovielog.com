import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { clickSelectFieldOption } from "~/components/fields/SelectField.testHelper";

export async function clickCollectionFilterOption(
  user: UserEvent,
  value: string,
) {
  await clickSelectFieldOption(user, "Collection", value);
}

export async function clickDirectorFilterOption(
  user: UserEvent,
  value: string,
) {
  await clickSelectFieldOption(user, "Director", value);
}

export async function clickPerformerFilterOption(
  user: UserEvent,
  value: string,
) {
  await clickSelectFieldOption(user, "Performer", value);
}

export async function clickWriterFilterOption(user: UserEvent, value: string) {
  await clickSelectFieldOption(user, "Writer", value);
}

export function getDirectorFilter() {
  return screen.getByLabelText("Director");
}

export function getPerformerFilter() {
  return screen.getByLabelText("Performer");
}
