/**
 * Formats a date into a human-readable string.
 * @param date - The date to format (Date object, string, or undefined)
 * @param options - Formatting options
 * @param options.dayFormat - Day format ("numeric" for "1" or "2-digit" for "01", defaults to "numeric")
 * @param options.includeWeekday - Whether to include weekday in output (defaults to false)
 * @returns Formatted date string (e.g., "Jan 15, 2024" or "Wed, Jan 15, 2024") or empty string if date is undefined
 */
export function displayDate(
  date: Date | string | undefined,
  {
    dayFormat = "numeric",
    includeWeekday = false,
  }: {
    dayFormat?: "2-digit" | "numeric";
    includeWeekday?: boolean;
  } = {},
) {
  if (!date) {
    return "";
  }

  const viewingDate = new Date(date);

  const formatter = new Intl.DateTimeFormat("en-US", {
    day: dayFormat,
    month: "short",
    timeZone: "UTC",
    weekday: "short",
    year: "numeric",
  });

  const parts = formatter.formatToParts(viewingDate);
  const weekday = parts.find((part) => part.type === "weekday")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  const year = parts.find((part) => part.type === "year")?.value;

  const weekdayFormatted = includeWeekday ? `${weekday}, ` : "";

  return `${weekdayFormatted}${month} ${day}, ${year}`;
}
