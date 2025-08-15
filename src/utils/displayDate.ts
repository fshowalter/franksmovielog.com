export function displayDate(date: string | undefined) {
  if (!date) {
    return "";
  }

  const viewingDate = new Date(date);

  return `${viewingDate.toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "short",
  })}, ${viewingDate.toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  })} ${viewingDate.toLocaleDateString("en-US", {
    day: "2-digit",
    timeZone: "UTC",
  })}, ${viewingDate.toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
  })}`;
}
