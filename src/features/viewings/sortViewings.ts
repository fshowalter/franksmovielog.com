import { createSorter } from "~/sorters/createSorter";

import type { ViewingsValue } from "./Viewings";

/**
 * Sort type for viewings.
 */
export type ViewingsSort = "viewing-date-asc" | "viewing-date-desc";

/**
 * Sorter function for viewings, supporting chronological sorting by viewing date.
 */
export const sortViewings = createSorter<ViewingsValue, ViewingsSort>({
  "viewing-date-asc": (a, b) => a.sequence.localeCompare(b.sequence),
  "viewing-date-desc": (a, b) => b.sequence.localeCompare(a.sequence),
});
