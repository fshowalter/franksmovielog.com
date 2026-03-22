export const viewingMonthFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

export const viewingYearFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
});

export const viewingDayFormat = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  timeZone: "UTC",
});

export const viewingWeekdayFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  weekday: "short",
});
