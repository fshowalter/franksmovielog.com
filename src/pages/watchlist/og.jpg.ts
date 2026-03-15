import type { APIRoute } from "astro";

import { watchlistOpenGraphImageResponse } from "~/features/watchlist/watchlistOpenGraphImageResponse";

export const GET: APIRoute = async function get() {
  return await watchlistOpenGraphImageResponse();
};
