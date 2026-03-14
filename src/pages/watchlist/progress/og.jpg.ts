import type { APIRoute } from "astro";

import { watchlistProgressOpenGraphImageResponse } from "~/features/watchlist-progress/watchlistProgressOpenGraphImageResponse";

export const GET: APIRoute = async function get() {
  return await watchlistProgressOpenGraphImageResponse();
};
