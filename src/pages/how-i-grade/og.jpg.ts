import type { APIRoute } from "astro";

import { createOpenGraphImageResponse } from "~/utils/createOpenGraphImageResponse";

export const GET: APIRoute = async function get() {
  return createOpenGraphImageResponse({
    backdropSlug: "how-i-grade",
    title: "How I Grade",
  });
};
