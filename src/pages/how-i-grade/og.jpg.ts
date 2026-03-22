import type { APIRoute } from "astro";

import { openGraphImageResponse } from "~/utils/openGraphImageResponse";

export const GET: APIRoute = async function get() {
  return openGraphImageResponse("How I Grade", "how-i-grade");
};
