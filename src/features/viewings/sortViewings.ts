import { createSorter } from "~/sorters/createSorter";

import type { ViewingsValue } from "./Viewings";

export type ViewingsSort = "viewing-date-asc" | "viewing-date-desc";

export const sortViewings = createSorter<ViewingsValue, ViewingsSort>({
  "viewing-date-asc": (a, b) => a.viewingSequence - b.viewingSequence,
  "viewing-date-desc": (a, b) => b.viewingSequence - a.viewingSequence,
});
