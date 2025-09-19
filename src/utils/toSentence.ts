/**
 * Converts an array of strings into a grammatically correct sentence with proper conjunctions.
 * @param array - Array of strings to join into a sentence
 * @returns A formatted sentence string (e.g., ["a", "b", "c"] becomes "a, b, and c")
 */
export function toSentence(array: readonly string[]): string {
  return new Intl.ListFormat().format(array);
}
