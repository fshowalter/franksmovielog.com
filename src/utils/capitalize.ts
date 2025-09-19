/**
 * Capitalizes the first character of a string.
 * @param string - The string to capitalize
 * @returns The string with its first character in uppercase
 */
export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
