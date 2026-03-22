import { feed } from "~/features/feed/feed";

/**
 * Astro endpoint handler for generating the RSS feed.
 * @returns RSS feed response with recent movie reviews
 */
export async function GET() {
  return await feed();
}
