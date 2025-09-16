import type { ViewingsValue } from "./Viewings";

export function getMostRecentMonth(values: ViewingsValue[]): Date {
  if (values.length === 0) {
    return new Date();
  }

  // Get the most recent viewing date
  const sortedValues = [...values].sort(
    (a, b) => b.viewingSequence - a.viewingSequence,
  );
  const mostRecentDate = new Date(sortedValues[0].viewingDate);

  // Create a date for the first day of that month
  return new Date(
    mostRecentDate.getUTCFullYear(),
    mostRecentDate.getUTCMonth(),
    1,
  );
}
