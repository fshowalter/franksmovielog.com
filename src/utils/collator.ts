/**
 * Locale-aware string collator for consistent sorting across the application.
 * Configured to ignore punctuation, use numeric sorting, and be case-insensitive.
 */
export const collator = new Intl.Collator("en", {
  ignorePunctuation: true,
  numeric: true,
  sensitivity: "base",
});
