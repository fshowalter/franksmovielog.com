import { z } from "zod";

/**
 * Creates a Zod schema for nullable numbers that transforms null to undefined.
 * @returns Zod schema that accepts number or null and outputs number or undefined
 */
export function nullableNumber() {
  return z.nullable(z.number()).transform((data) => data ?? undefined);
}

/**
 * Creates a Zod schema for nullable strings that transforms null to undefined.
 * @returns Zod schema that accepts string or null and outputs string or undefined
 */
export function nullableString() {
  return z.nullable(z.string()).transform((data) => data ?? undefined);
}
