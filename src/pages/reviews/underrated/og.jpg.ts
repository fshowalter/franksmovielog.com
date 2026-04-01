import type { APIRoute } from "astro";

import { createOpenGraphImageResponse } from "~/utils/createOpenGraphImageResponse";

export const GET: APIRoute = async function get() {
  return await createOpenGraphImageResponse({
    backdropSlug: "underrated",
    title: "Underrated Surprises",
  });
};
