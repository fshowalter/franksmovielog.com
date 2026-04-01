import type { APIRoute } from "astro";

import { createOpenGraphImageResponse } from "~/utils/createOpenGraphImageResponse";

export const GET: APIRoute = async function get() {
  return await createOpenGraphImageResponse({
    backdropSlug: "stats",
    title: "All-Time Stats",
  });
};
