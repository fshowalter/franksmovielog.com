import { updates } from "~/features/updates/updates";

/**
 * Astro endpoint handler for generating the updates JSON feed.
 * @returns JSON response with recent review updates
 */
export async function GET() {
  return await updates();
}
