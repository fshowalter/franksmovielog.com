import type { UserEvent } from "@testing-library/user-event";

import { screen } from "@testing-library/react";

import { clickSelectFieldOption } from "~/components/fields/SelectField.testHelper";

/**
 * Clicks a collection filter option in tests.
 * @param user - User event instance
 * @param value - Filter value to select
 */
export async function clickCollectionFilterOption(
  user: UserEvent,
  value: string,
) {
  await clickSelectFieldOption(user, "Collection", value);
}

/**
 * Clicks a director filter option in tests.
 * @param user - User event instance
 * @param value - Filter value to select
 */
export async function clickDirectorFilterOption(
  user: UserEvent,
  value: string,
) {
  await clickSelectFieldOption(user, "Director", value);
}

/**
 * Clicks a performer filter option in tests.
 * @param user - User event instance
 * @param value - Filter value to select
 */
export async function clickPerformerFilterOption(
  user: UserEvent,
  value: string,
) {
  await clickSelectFieldOption(user, "Performer", value);
}

/**
 * Clicks a writer filter option in tests.
 * @param user - User event instance
 * @param value - Filter value to select
 */
export async function clickWriterFilterOption(user: UserEvent, value: string) {
  await clickSelectFieldOption(user, "Writer", value);
}

/**
 * Gets the director filter element.
 * @returns Director filter element
 */
export function getDirectorFilter() {
  return screen.getByLabelText("Director");
}
