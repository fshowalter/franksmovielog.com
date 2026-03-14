import type { APIRoute } from "astro";

import { alltimeStatsOpenGraphImageResponse } from "~/features/stats/alltimeStatsOpenGraphImageResponse";

export const GET: APIRoute = async function get() {
  return await alltimeStatsOpenGraphImageResponse();
};
