import type { UserEvent } from "@testing-library/user-event";

import { clickCheckboxListOption } from "~/components/fields/CheckboxListField.testHelper";

/**
 * Clicks a collection filter option in tests.
 * @param user - User event instance
 * @param value - Filter value to select
 */
export async function clickCollectionFilterOption(
  user: UserEvent,
  value: string,
) {
  await clickCheckboxListOption(user, "Collection", value);
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
  await clickCheckboxListOption(user, "Director", value);
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
  await clickCheckboxListOption(user, "Performer", value);
}

/**
 * Clicks a writer filter option in tests.
 * @param user - User event instance
 * @param value - Filter value to select
 */
export async function clickWriterFilterOption(user: UserEvent, value: string) {
  await clickCheckboxListOption(user, "Writer", value);
}
